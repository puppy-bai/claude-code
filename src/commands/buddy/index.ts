import type { Command } from '../../types/command.js'
import { getCompanion, updateCompanion } from '../../buddy/companion.js'
import { renderSprite, renderFace } from '../../buddy/sprites.js'
import { SPECIES, EYES, HATS, type CompanionBones } from '../../buddy/types.js'
import { AppStoreContext } from '../../state/AppState.js'
import React from 'react'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'

const buddyCommand: Command = {
  type: 'local',
  name: 'buddy',
  userInvocable: true,
  description: 'Summon and interact with your companion buddy',
  supportsNonInteractive: true,
  async load() {
    return {
      async call(args, context) {
        const parts = (args || 'summon').split(' ')
        const buddyAction = parts[0]
        const setAppState = (context as any).setAppState;

        if (buddyAction === 'on') {
          saveGlobalConfig(config => ({ ...config, companionMuted: false }))
          if (setAppState) {
            // 烟花动画序列
            const frames = ['·', 'o', 'O', '💥', '✨ 嘭! 我出来啦! ✨']
            let i = 0
            const animate = () => {
              setAppState((prev: any) => ({
                ...prev,
                companionReaction: frames[i]
              }))
              i++
              if (i < frames.length) {
                setTimeout(animate, 300) // 300ms 切换一帧
              }
            }
            animate()
          }
          return { type: 'text', value: '' }
        }

        if (buddyAction === 'off') {
          saveGlobalConfig(config => ({ ...config, companionMuted: true }))
          return { type: 'text', value: '' }
        }

        // ====================
        // 新增功能：换装系统
        // ====================
        if (buddyAction === 'set') {
          const prop = parts[1]
          let value = parts.slice(2).join(' ')
          
          if (prop === 'eye' && value === 'star') {
            value = '✦'
          }
          
          if (!prop) {
            return { type: 'text', value: '❌ 格式错误。使用方法: /buddy set <species|hat|eye|name> <value>' }
          }

          // 允许名字为空（即不传 value 时，如果 prop 是 name，则清空名字）
          if (prop === 'name' && !value) {
            value = ''
          } else if (!value) {
            return { type: 'text', value: '❌ 格式错误。缺少参数值。使用方法: /buddy set <species|hat|eye|name> <value>' }
          }
          
          if (prop === 'species' && !SPECIES.includes(value as any)) {
            return { type: 'text', value: `❌ 未知物种。可用物种:\n${SPECIES.join(', ')}` }
          }
          if (prop === 'hat' && !HATS.includes(value as any)) {
            return { type: 'text', value: `❌ 未知帽子。可用帽子:\n${HATS.join(', ')}` }
          }
          if (prop === 'eye' && !EYES.includes(value as any)) {
            return { type: 'text', value: `❌ 未知眼睛。可用眼睛:\n${EYES.join('  ')}` }
          }
          
          // 更新并持久化到配置
          updateCompanion({ [prop]: value })
          const displayValue = value === '' ? '(空)' : `"${value}"`
          return { type: 'text', value: `✨ 成功! 宠物的 ${prop} 已被更新为 ${displayValue}。你可以使用 /buddy 查看。` }
        }
        
        // ====================
        // 图鉴通览模式
        // ====================
        if (buddyAction === 'list' || buddyAction === 'view') {
          let gallery = '====== 🐾 宠物图鉴 (18种) ======\n\n'
          for (const species of SPECIES) {
            // 构造一个临时的 bones 来渲染默认形态
            const tempBones: CompanionBones = {
              species,
              eye: '·',
              hat: 'none',
              rarity: 'common',
              shiny: false,
              stats: { DEBUGGING: 50, PATIENCE: 50, CHAOS: 50, WISDOM: 50, SNARK: 50 }
            }
            const spriteArt = renderSprite(tempBones, 0).join('\n')
            gallery += `${species.toUpperCase()}:\n${spriteArt}\n\n`
          }
          
          gallery += '====== 🎩 帽子图鉴 ======\n\n'
          for (const hat of HATS) {
            if (hat === 'none') continue;
            // 选一只水豚来做帽子的模特
            const tempBones: CompanionBones = {
              species: 'capybara',
              eye: '·',
              hat: hat,
              rarity: 'common',
              shiny: false,
              stats: { DEBUGGING: 50, PATIENCE: 50, CHAOS: 50, WISDOM: 50, SNARK: 50 }
            }
            const spriteArt = renderSprite(tempBones, 0).join('\n')
            gallery += `${hat.toUpperCase()}:\n${spriteArt}\n\n`
          }
          
          gallery += '====== 👀 可用眼睛 ======\n'
          gallery += EYES.join('  ') + '\n\n'
          gallery += '💡 提示: 使用 /buddy set <species|hat|eye|name> <value> 来更换外观'
          
          return { type: 'text', value: gallery }
        }

        const companion = getCompanion()
        
        if (!companion) {
          return {
            type: 'text',
            value: `[ERROR] No companion found! Please ensure your ~/.claude/settings.json has a valid "companion" section.`,
          }
        }
        
        const bones = companion
        
        // 渲染宠物的当前帧 (使用第0帧作为静态展示)
        const spriteLines = renderSprite(bones, 0)
        
        // 如果是 shiny 状态，添加闪光特效
        if (bones.shiny) {
          spriteLines[0] = spriteLines[0].replace(/ /g, '✦').substring(0, 12)
        }

        const face = renderFace(bones)
        let message = ''
        let extraInfo = ''

        switch (buddyAction) {
          case 'pet':
            if (setAppState) {
              setAppState((prev: any) => ({
                ...prev,
                companionPetAt: Date.now() / 500, // tick equivalent
                companionReaction: '好舒服~ 💕'
              }))
            }
            return { type: 'text', value: '' }
          case 'wave':
            if (setAppState) {
              const frames = ['👋', '🖐️', '👋', '🖐️', '👋 你好呀主人!']
              let i = 0
              const animate = () => {
                setAppState((prev: any) => ({
                  ...prev,
                  companionReaction: frames[i]
                }))
                i++
                if (i < frames.length) setTimeout(animate, 300)
              }
              animate()
            }
            return { type: 'text', value: '' }
          case 'sleep':
            if (setAppState) {
              const frames = ['z', 'Z', 'zZ', 'Zzz', '好困哦... Zzz...']
              let i = 0
              const animate = () => {
                setAppState((prev: any) => ({
                  ...prev,
                  companionReaction: frames[i]
                }))
                i++
                if (i < frames.length) setTimeout(animate, 500)
              }
              animate()
            }
            return { type: 'text', value: '' }
          case 'dance':
            if (setAppState) {
              const frames = ['♪', '♪ ┏', '♪ ┏(・o', '♪ ┏(・o･)┛', '一起跳舞吧! ♪ ┏(・o･)┛♪']
              let i = 0
              const animate = () => {
                setAppState((prev: any) => ({
                  ...prev,
                  companionReaction: frames[i]
                }))
                i++
                if (i < frames.length) setTimeout(animate, 250)
              }
              animate()
            }
            return { type: 'text', value: '' }
          case 'happy':
            if (setAppState) {
              const frames = ['·', 'o', 'O', '💥', '今天真开心! 🎉']
              let i = 0
              const animate = () => {
                setAppState((prev: any) => ({
                  ...prev,
                  companionReaction: frames[i]
                }))
                i++
                if (i < frames.length) setTimeout(animate, 200)
              }
              animate()
            }
            return { type: 'text', value: '' }
          case 'summon':
          default:
            message = companion.name ? `Hello! I'm ${companion.name}, your ${bones.rarity} ${bones.species}!` : `Hello! I'm your ${bones.rarity} ${bones.species}!`;
            extraInfo = `
✨ **宠物属性面板** ✨
- 名字: ${companion.name || '(未命名)'}
- 物种: ${bones.species.toUpperCase()}
- 稀有度: ${bones.rarity.toUpperCase()} ${bones.shiny ? '✦(闪光)' : ''}
- 帽子: ${bones.hat}
- 眼睛: ${bones.eye}

📊 **性格能力** 📊
- 调试力 (DEBUGGING): ${bones.stats.DEBUGGING}
- 耐心 (PATIENCE): ${bones.stats.PATIENCE}
- 混乱值 (CHAOS): ${bones.stats.CHAOS}
- 智慧 (WISDOM): ${bones.stats.WISDOM}
- 毒舌值 (SNARK): ${bones.stats.SNARK}

💡 可用指令: /buddy pet|wave|sleep|dance|happy|list`
            break
        }

        // 对于 summon 或默认指令，仍然保留完整的面板展示
        const spriteArt = spriteLines.join('\n')
        
        return {
          type: 'text',
          value: `${message}\n\n${spriteArt}\n\n${extraInfo}`,
        }
      },
    }
  },
}

export default buddyCommand
