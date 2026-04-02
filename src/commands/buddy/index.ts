import type { Command } from '../../types/command.js'

const buddyCommand: Command = {
  type: 'local-jsx',
  name: 'buddy',
  immediate: true,
  userInvocable: true,
  description: 'Summon and interact with your companion buddy',
  load: () => import('./buddyApp.js'),
}

export default buddyCommand
