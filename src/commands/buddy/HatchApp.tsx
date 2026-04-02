import React, { useEffect, useState } from 'react'
import { Box, Text } from '../../ink.js'
import { getCompanion, updateCompanion, roll } from '../../buddy/companion.js'
import { renderSprite, renderFace } from '../../buddy/sprites.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'
import { TextInput } from '../../components/TextInput.js'
import type { CompanionBones } from '../../buddy/types.js'
import { companionUserId } from '../../buddy/companion.js'

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

export function HatchApp({ onDone, setAppState, isReset = false }: { onDone: any, setAppState: any, isReset?: boolean }) {
  const [frame, setFrame] = useState(0)
  const [bones, setBones] = useState<CompanionBones | null>(null)
  const [name, setName] = useState('')
  const [phase, setPhase] = useState<'animating' | 'naming'>('animating')

  useEffect(() => {
    if (phase !== 'animating') return
    if (frame < HATCH_FRAMES.length) {
      const timer = setTimeout(() => setFrame(frame + 1), 800)
      return () => clearTimeout(timer)
    } else {
      // Hatching done, generate pet
      const seed = Date.now().toString()
      const { bones: newBones } = roll(seed)
      // Force default eye to star for new pets
      newBones.eye = '✦'
      setBones(newBones)
      setPhase('naming')
    }
  }, [frame, phase])

  const handleNameSubmit = () => {
    if (!bones) return
    const finalName = name.trim()
    
    // Save to global config
    const config = getGlobalConfig()
    config.companion = {
      name: finalName,
      personality: 'A newly born companion',
      hatchedAt: Date.now(),
      ...bones,
    } as any
    saveGlobalConfig(config)
    
    // Update app state to trigger render in bottom right
    setAppState((prev: any) => ({
      ...prev,
      companionReaction: '✨',
      companionPetAt: Date.now() / 500
    }))
    
    const spriteLines = renderSprite(bones, 0)
    if (bones.shiny) {
      spriteLines[0] = spriteLines[0].replace(/ /g, '✦').substring(0, 12)
    }
    
    const spriteArt = spriteLines.join('\n')
    const message = finalName ? `Hello! I'm ${finalName}, your ${bones.rarity} ${bones.species}!` : `Hello! I'm your ${bones.rarity} ${bones.species}!`
    const result = `${message}\n\n${spriteArt}\n\n✨ **孵化成功！**\n你的伙伴已出生并在右下角陪伴你。使用 /buddy list 查看图鉴，或 /buddy set 进行换装！`
    
    onDone(result, { display: 'system' })
  }

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
      {phase === 'animating' && (
        <>
          <Text bold color="yellow">{isReset ? '重新孵化中...' : '正在孵化你的赛博伙伴...'}</Text>
          <Box marginTop={1}>
            <Text>{(HATCH_FRAMES[frame] || HATCH_FRAMES[HATCH_FRAMES.length - 1]).join('\n')}</Text>
          </Box>
        </>
      )}
      {phase === 'naming' && bones && (
        <>
          <Text bold color="green">🎉 孵化成功！是一只 {bones.rarity} 的 {bones.species}！</Text>
          <Box marginTop={1} marginBottom={1}>
            <Text>{renderSprite(bones, 0).join('\n')}</Text>
          </Box>
          <Box flexDirection="row">
            <Text>给它起个独一无二的名字吧 (直接回车保持默认): </Text>
            <TextInput value={name} onChange={setName} onSubmit={handleNameSubmit} />
          </Box>
        </>
      )}
    </Box>
  )
}