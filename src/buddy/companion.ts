import { getGlobalConfig } from '../utils/config.js'
import {
  type Companion,
  type CompanionBones,
  EYES,
  HATS,
  RARITIES,
  RARITY_WEIGHTS,
  type Rarity,
  SPECIES,
  STAT_NAMES,
  type StatName,
} from './types.js'

// Mulberry32 — tiny seeded PRNG, good enough for picking ducks
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  if (typeof Bun !== 'undefined') {
    return Number(BigInt(Bun.hash(s)) & 0xffffffffn)
  }
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

function rollRarity(rng: () => number): Rarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0)
  let roll = rng() * total
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity]
    if (roll < 0) return rarity
  }
  return 'common'
}

const RARITY_FLOOR: Record<Rarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 25,
  epic: 35,
  legendary: 50,
}

// One peak stat, one dump stat, rest scattered. Rarity bumps the floor.
function rollStats(
  rng: () => number,
  rarity: Rarity,
): Record<StatName, number> {
  const floor = RARITY_FLOOR[rarity]
  const peak = pick(rng, STAT_NAMES)
  let dump = pick(rng, STAT_NAMES)
  while (dump === peak) dump = pick(rng, STAT_NAMES)

  const stats = {} as Record<StatName, number>
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    } else {
      stats[name] = floor + Math.floor(rng() * 40)
    }
  }
  return stats
}

const SALT = 'friend-2026-401'

export type Roll = {
  bones: CompanionBones
  inspirationSeed: number
}

function rollFrom(rng: () => number): Roll {
  const rarity = rollRarity(rng)
  const bones: CompanionBones = {
    rarity,
    species: pick(rng, SPECIES),
    eye: pick(rng, EYES),
    hat: pick(rng, HATS),
    shiny: rng() < 0.01,
    stats: rollStats(rng, rarity),
  }
  return { bones, inspirationSeed: Math.floor(rng() * 1e9) }
}

// Called from three hot paths (500ms sprite tick, per-keystroke PromptInput,
// per-turn observer) with the same userId → cache the deterministic result.
let rollCache: { key: string; value: Roll } | undefined
export function roll(userId: string): Roll {
  const key = userId + SALT
  if (rollCache?.key === key) return rollCache.value
  const value = rollFrom(mulberry32(hashString(key)))
  rollCache = { key, value }
  return value
}

export function rollWithSeed(seed: string): Roll {
  return rollFrom(mulberry32(hashString(seed)))
}

export function companionUserId(): string {
  const config = getGlobalConfig()
  return config.oauthAccount?.accountUuid ?? config.userID ?? 'anon'
}

// Regenerate bones from userId, merge with stored soul. Bones never persist
// so species renames and SPECIES-array edits can't break stored companions,
// and editing config.companion can't fake a rarity.
export function getCompanion(): Companion | undefined {
  const stored = getGlobalConfig().companion
  
  if (!stored) {
    return undefined
  }
  
  const { bones } = roll(companionUserId())
  // 从 stored 中提取非 bones 属性，确保 bones 始终是嵌套对象
  const { species, hat, eye, rarity, shiny, stats, bones: legacyBones, ...soul } = stored as any
  
  // 允许 stored 中的外观属性覆盖随机生成的 bones 属性
  const customBones = { ...bones }
  if (species) customBones.species = species
  if (hat) customBones.hat = hat
  if (eye) customBones.eye = eye
  if (rarity) customBones.rarity = rarity
  if (shiny !== undefined) customBones.shiny = shiny
  if (stats) customBones.stats = stats
  
  return { ...soul, ...customBones } as unknown as Companion
}

export function updateCompanion(updates: Partial<Companion>): void {
  import('../utils/config.js').then(({ saveGlobalConfig, getGlobalConfig }) => {
    saveGlobalConfig(config => {
      const current = config.companion || getCompanion()
      // Remove legacy 'bones' object from settings if it exists
      if (current && (current as any).bones) {
        delete (current as any).bones
      }
      // Extract soul properties to save, avoiding saving bones properties in config
      const { species, hat, eye, rarity, shiny, stats, ...soulUpdates } = updates as any
      
      const newCompanion = {
        ...current,
        ...soulUpdates,
      } as any;
      
      if (species !== undefined) newCompanion.species = species;
      if (hat !== undefined) newCompanion.hat = hat;
      if (eye !== undefined) newCompanion.eye = eye;
      if (stats !== undefined) newCompanion.stats = stats;
      
      return {
        ...config,
        companion: newCompanion,
      }
    })
  })
}

// Gain experience points for a specific stat.
// Triggers a notification and potentially unlocks a hat if it reaches 100.
export function gainExperience(stat: StatName, amount: number): void {
  const companion = getCompanion();
  if (!companion) return;
  
  const currentVal = (companion.stats && companion.stats[stat]) || 0;
  if (currentVal >= 100) return; // Already maxed
  
  const newVal = Math.min(100, currentVal + amount);
  
  // Create a clean copy of the stats to save
  const newStats = { ...(companion.stats || {}), [stat]: newVal };
  
  let newHat = companion.hat;
  let unlockedHat = false;
  let unlockMsg = '';
  
  if (newVal === 100 && currentVal < 100) {
    unlockedHat = true;
    if (stat === 'DEBUGGING') { newHat = 'halo'; unlockMsg = 'Debug大师！解锁了光环(halo)'; }
    else if (stat === 'PATIENCE') { newHat = 'crown'; unlockMsg = '耐心王者！解锁了皇冠(crown)'; }
    else if (stat === 'CHAOS') { newHat = 'propeller'; unlockMsg = '混沌行者！解锁了竹蜻蜓(propeller)'; }
    else if (stat === 'WISDOM') { newHat = 'wizard'; unlockMsg = '大贤者！解锁了法师帽(wizard)'; }
    else if (stat === 'SNARK') { newHat = 'beanie'; unlockMsg = '毒舌之王！解锁了冷帽(beanie)'; }
  }
  
  // Use updateCompanion correctly, wrapping stats under the companion object structure
  import('../utils/config.js').then(({ saveGlobalConfig }) => {
    saveGlobalConfig(config => {
      const currentComp = config.companion || getCompanion();
      return {
        ...config,
        companion: {
          ...currentComp,
          stats: newStats,
          hat: newHat
        }
      } as any;
    });
  });
  
  import('../state/AppStateStore.js').then(({ useAppStateStore }) => {
    const store = useAppStateStore.getState();
    const expMsg = unlockedHat ? `🎉 ${stat} 满级！${unlockMsg}` : `✨ ${stat} +${amount}`;
    store.setAppState(prev => ({
      ...prev,
      companionExpGain: expMsg
    }));
  });
}
