import chalk from 'chalk';

function renderProgressBar(value, colorHex) {
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
  return chalk.hex(colorHex).bgHex('#22252A')(barString);
}

console.log(`DEBUGGING   ${renderProgressBar(22, '#5dade2')}   22`);
console.log(`PATIENCE    ${renderProgressBar(16, '#58d68d')}   16`);
console.log(`CHAOS       ${renderProgressBar(11, '#ec7063')}   11`);
console.log(`WISDOM      ${renderProgressBar(1, '#af7ac5')}   1`);
console.log(`SNARK       ${renderProgressBar(67, '#f4d03f')}   67`);
