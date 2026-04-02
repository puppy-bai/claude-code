import React, { useEffect, useState } from 'react'
import { Box, Text, useInput } from '../../ink.js'
import { getCompanion, updateCompanion, rollWithSeed } from '../../buddy/companion.js'
import { renderSprite } from '../../buddy/sprites.js'
import { SPECIES, EYES, HATS, type CompanionBones } from '../../buddy/types.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'
import chalk from 'chalk'
import type { LocalJSXCommandCall } from '../../types/command.js'

function renderProgressBar(value: number, colorHex: string): string {
  const width = 30;
  const ratio = Math.min(1, Math.max(0, value / 100));
  const filled = Math.floor(ratio * width);
  const remainder = ratio * width - filled;
  
  const BLOCKS = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
  
  let segments = [];
  if (filled > 0) segments.push('█'.repeat(filled));
  if (filled < width) {
    const fractionIdx = Math.floor(remainder * BLOCKS.length);
    segments.push(BLOCKS[fractionIdx]);
    const empty = width - filled - 1;
    if (empty > 0) {
      segments.push(' '.repeat(empty));
    }
  }
  
  const barString = segments.join('');
  return chalk.hex(colorHex).bgHex('#2C2E33')(barString);
}

const HATCH_FRAMES = [
  [
    '            ',
    '            ',
    '   .----.   ',
    '  (      )  ',
    '   `----´   ',
  ],
  [
    '            ',
    '   .----.   ',
    '  (/    \\)  ',
    '  (\\    /)  ',
    '   `----´   ',
  ],
  [
    '    \\||/    ',
    '   .----.   ',
    '  (  ><  )  ',
    '  (      )  ',
    '   `----´   ',
  ],
]

export const call: LocalJSXCommandCall = async (onDone, context, args) => {
  return <BuddyApp onDone={onDone} args={args} setAppState={context.setAppState} />
}

function BuddyApp({ args, onDone, setAppState }: any) {
  const [phase, setPhase] = useState<'init' | 'animating' | 'naming' | 'done'>('init')
  const [frame, setFrame] = useState(0)
  const [bones, setBones] = useState<CompanionBones | null>(null)
  const [name, setName] = useState('')
  const [isReset, setIsReset] = useState(false)

  useEffect(() => {
    if (phase !== 'init') return

    const parts = args.trim().split(/\s+/)
    const buddyAction = parts[0]?.toLowerCase() || 'summon'
    const stored = getGlobalConfig().companion

    if (buddyAction === 'reset') {
      // 强制清空现有宠物
      saveGlobalConfig(config => ({ ...config, companion: undefined }))
      setIsReset(true)
      setPhase('animating')
      return
    }

    if (!stored || buddyAction === 'hatch') {
      setIsReset(buddyAction === 'hatch')
      setPhase('animating')
      return
    }

    // Normal command logic
    const companion = getCompanion()!
    let message = ''
    let extraInfo = ''
    const spriteLines = renderSprite(companion, 0)
    if (companion.shiny) {
      spriteLines[0] = spriteLines[0].replace(/ /g, '✦').substring(0, 12)
    }

    switch (buddyAction) {
      case 'on':
        saveGlobalConfig(config => ({ ...config, companionMuted: false }))
        if (setAppState) {
          const frames = ['·', 'o', 'O', '💥', '✨', '']
          let i = 0
          const animate = () => {
            setAppState((prev: any) => ({ ...prev, companionReaction: frames[i] }))
            i++
            if (i < frames.length) setTimeout(animate, 150)
          }
          animate()
        }
        setPhase('done')
        onDone('✨ 电子宠物已显示在终端右下角。', { display: 'system' })
        return
      case 'off':
        saveGlobalConfig(config => ({ ...config, companionMuted: true }))
        setPhase('done')
        onDone('💤 电子宠物已隐藏。使用 /buddy on 唤醒。', { display: 'system' })
        return
      case 'list':
      case 'view':
        let gallery = '====== 🐾 宠物图鉴 (18种) ======\n\n'
        for (const species of SPECIES) {
          const tempBones: any = { species, eye: '✦', hat: 'none', rarity: 'common', shiny: false, stats: { DEBUGGING: 50, PATIENCE: 50, CHAOS: 50, WISDOM: 50, SNARK: 50 } }
          gallery += `${species.padEnd(14, ' ')}:\n${renderSprite(tempBones, 0).join('\n')}\n\n`
        }
        gallery += '====== 🎩 帽子图鉴 ======\n\n'
        for (const hat of HATS) {
          if (hat === 'none') continue
          const tempBones: any = { species: 'capybara', eye: '✦', hat: hat, rarity: 'common', shiny: false, stats: { DEBUGGING: 50, PATIENCE: 50, CHAOS: 50, WISDOM: 50, SNARK: 50 } }
          gallery += `${hat.padEnd(14, ' ')}:\n${renderSprite(tempBones, 0).join('\n')}\n\n`
        }
        setPhase('done')
        onDone(gallery, { display: 'system' })
        return
      case 'set':
        const prop = parts[1]
        let value = parts.slice(2).join(' ')
        if (prop === 'eye' && value === 'star') value = '✦'
        if (!prop) {
          setPhase('done')
          onDone('❌ 格式错误。使用方法: /buddy set <species|hat|eye|name> <value>', { display: 'system' })
          return
        }
        if (prop === 'name' && !value) {
          value = ''
        } else if (!value) {
          setPhase('done')
          onDone('❌ 格式错误。缺少参数值。使用方法: /buddy set <species|hat|eye|name> <value>', { display: 'system' })
          return
        }
        if (prop === 'species' && !SPECIES.includes(value as any)) {
          setPhase('done')
          onDone(`❌ 未知物种。可用物种:\n${SPECIES.join(', ')}`, { display: 'system' })
          return
        }
        if (prop === 'hat' && !HATS.includes(value as any)) {
          setPhase('done')
          onDone(`❌ 未知帽子。可用帽子:\n${HATS.join(', ')}`, { display: 'system' })
          return
        }
        if (prop === 'eye' && !EYES.includes(value as any)) {
          setPhase('done')
          onDone(`❌ 未知眼睛。可用眼睛:\n${EYES.join('  ')}`, { display: 'system' })
          return
        }
        updateCompanion({ [prop]: value })
        const displayValue = value === '' ? '(空)' : `"${value}"`
        setPhase('done')
        onDone(`✨ 成功! 宠物的 ${prop} 已被更新为 ${displayValue}。你可以使用 /buddy 查看。`, { display: 'system' })
        return
      case 'pet':
        if (setAppState) setAppState((prev: any) => ({ ...prev, companionPetAt: Date.now() / 500, companionReaction: '好舒服~ 💕' }))
        setPhase('done')
        onDone()
        return
      case 'wave':
        if (setAppState) {
          const frames = ['👋', '🖐️', '👋', '🖐️', '👋 你好呀主人!']
          let i = 0
          const animate = () => {
            setAppState((prev: any) => ({ ...prev, companionReaction: frames[i] }))
            i++
            if (i < frames.length) setTimeout(animate, 300)
          }
          animate()
        }
        setPhase('done')
        onDone()
        return
      case 'sleep':
        if (setAppState) {
          const frames = ['Z', 'Zz', 'Zzz', '好困哦... Zzz...']
          let i = 0
          const animate = () => {
            setAppState((prev: any) => ({ ...prev, companionReaction: frames[i] }))
            i++
            if (i < frames.length) setTimeout(animate, 400)
          }
          animate()
        }
        setPhase('done')
        onDone()
        return
      case 'dance':
        if (setAppState) {
          const frames = ['♪', '♪ ┏', '♪ ┏(・o', '♪ ┏(・o･)┛', '一起跳舞吧! ♪ ┏(・o･)┛♪']
          let i = 0
          const animate = () => {
            setAppState((prev: any) => ({ ...prev, companionReaction: frames[i] }))
            i++
            if (i < frames.length) setTimeout(animate, 250)
          }
          animate()
        }
        setPhase('done')
        onDone()
        return
      case 'happy':
        if (setAppState) {
          const frames = ['·', 'o', 'O', '💥', '✨', '今天真开心! 🎉']
          let i = 0
          const animate = () => {
            setAppState((prev: any) => ({ ...prev, companionReaction: frames[i] }))
            i++
            if (i < frames.length) setTimeout(animate, 200)
          }
          animate()
        }
        setPhase('done')
        onDone()
        return
      case 'summon':
      default:
        message = companion.name ? `Hello! I'm ${companion.name}, your ${companion.rarity} ${companion.species}!` : `Hello! I'm your ${companion.rarity} ${companion.species}!`
        extraInfo = `
✨ **宠物属性面板** ✨
- 名字: ${companion.name || '(未命名)'}
- 物种: ${companion.species.toUpperCase()}
- 稀有度: ${companion.rarity.toUpperCase()} ${companion.shiny ? '✦(闪光)' : ''}
- 帽子: ${companion.hat}
- 眼睛: ${companion.eye}

📊 **性格能力** 📊
DEBUGGING   ${renderProgressBar(companion.stats.DEBUGGING, '#5DADE2')}  ${companion.stats.DEBUGGING.toString().padStart(2, ' ')}
PATIENCE    ${renderProgressBar(companion.stats.PATIENCE, '#58D68D')}  ${companion.stats.PATIENCE.toString().padStart(2, ' ')}
CHAOS       ${renderProgressBar(companion.stats.CHAOS, '#EC7063')}  ${companion.stats.CHAOS.toString().padStart(2, ' ')}
WISDOM      ${renderProgressBar(companion.stats.WISDOM, '#AF7AC5')}  ${companion.stats.WISDOM.toString().padStart(2, ' ')}
SNARK       ${renderProgressBar(companion.stats.SNARK, '#F4D03F')}  ${companion.stats.SNARK.toString().padStart(2, ' ')}

💡 可用指令: /buddy pet|wave|sleep|dance|happy|list|reset`
        const spriteArt = spriteLines.join('\n')
        setPhase('done')
        onDone(`${message}\n\n${spriteArt}\n\n${extraInfo}`, { display: 'system' })
        return
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'animating') return
    if (frame < HATCH_FRAMES.length) {
      const timer = setTimeout(() => setFrame(frame + 1), 800)
      return () => clearTimeout(timer)
    } else {
      const seed = Date.now().toString()
      const { bones: newBones } = rollWithSeed(seed)
      setBones(newBones)
      setPhase('naming')
    }
  }, [frame, phase])

  const handleNameSubmit = (finalName: string) => {
    if (!bones) return
    finalName = finalName.trim()
    
    setPhase('done')
    
    saveGlobalConfig(config => ({
      ...config,
      companionMuted: false,
      companion: {
        name: finalName,
        personality: 'A newly born companion',
        hatchedAt: Date.now(),
        ...bones,
      } as any
    }))
    
    if (setAppState) {
      setAppState((prev: any) => ({
        ...prev,
        companionReaction: '✨',
        companionPetAt: Date.now() / 500
      }))
    }
    
    const spriteLines = renderSprite(bones, 0)
    if (bones.shiny) {
      spriteLines[0] = spriteLines[0].replace(/ /g, '✦').substring(0, 12)
    }
    
    const spriteArt = spriteLines.join('\n')
    const message = finalName ? `Hello! I'm ${finalName}, your ${bones.rarity} ${bones.species}!` : `Hello! I'm your ${bones.rarity} ${bones.species}!`
    const result = `${message}\n\n${spriteArt}\n\n✨ **孵化成功！**\n你的伙伴已出生并在右下角陪伴你。使用 /buddy list 查看图鉴，或 /buddy set 进行换装！`
    
    onDone(result, { display: 'system' })
  }

  useInput((input, key) => {
    if (phase !== 'naming') return
    if (key.return) {
      handleNameSubmit(name)
    } else if (key.backspace || key.delete) {
      setName(prev => prev.slice(0, -1))
    } else if (!key.ctrl && !key.meta && !key.upArrow && !key.downArrow && !key.leftArrow && !key.rightArrow) {
      setName(prev => prev + input)
    }
  }, { isActive: phase === 'naming' })

  if (phase === 'animating') {
    return (
      <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
        <Text bold color="yellow">{isReset ? '正在重新孵化赛博伙伴...' : '正在孵化你的赛博伙伴...'}</Text>
        <Box marginTop={1}>
          <Text>{(HATCH_FRAMES[frame] || HATCH_FRAMES[HATCH_FRAMES.length - 1]).join('\n')}</Text>
        </Box>
      </Box>
    )
  }

  if (phase === 'naming' && bones) {
    const spriteLines = renderSprite(bones, 0)
    if (bones.shiny) {
      spriteLines[0] = spriteLines[0].replace(/ /g, '✦').substring(0, 12)
    }

    return (
      <Box flexDirection="column" padding={1} borderStyle="round" borderColor="green">
        <Text bold color="green">🎉 孵化成功！是一只 {bones.rarity} 的 {bones.species}！</Text>
        <Box marginTop={1} marginBottom={1}>
          <Text>{spriteLines.join('\n')}</Text>
        </Box>
        <Box flexDirection="row">
          <Text>给它起个独一无二的名字吧 (直接回车保持默认空名字): </Text>
          <Text color="cyan">{name}</Text>
          <Text>█</Text>
        </Box>
      </Box>
    )
  }

  return null
}
