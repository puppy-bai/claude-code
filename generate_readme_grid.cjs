const fs = require('fs');

// 直接使用原始的、未经处理的字符串
const BODIES = {
  duck: [
    '    __      ',
    '  <({E} )___  ',
    '   (  ._>   ',
    '    `--´    ',
  ],
  goose: [
    '     ({E}>    ',
    '     ||     ',
    '   _(__)_   ',
    '    ^^^^    ',
  ],
  blob: [
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (      )  ',
    '   `----´   ',
  ],
  cat: [
    '   /\\_/\\    ',
    '  ( {E}   {E})  ',
    '  (  ω  )   ',
    '  (")_(")   ',
  ],
  dragon: [
    '  /^\\  /^\\  ',
    ' <  {E}  {E}  > ',
    ' (   ~~   ) ',
    '  `-vvvv-´  ',
  ],
  octopus: [
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (______)  ',
    '  /\\/\\/\\/\\  ',
  ],
  owl: [
    '   /\\  /\\   ',
    '  (({E})({E}))  ',
    '  (  ><  )  ',
    '   `----´   ',
  ],
  penguin: [
    '  .---.     ',
    '  ({E}>{E})     ',
    ' /(   )\\    ',
    '  `---´     ',
  ],
  turtle: [
    '   _,--._   ',
    '  ( {E}  {E} )  ',
    ' /[______]\\ ',
    '  ``    ``  ',
  ],
  snail: [
    ' {E}    .--.  ',
    '  \\  ( @ )  ',
    '   \\_`--´   ',
    '  ~~~~~~~   ',
  ],
  ghost: [
    '   .----.   ',
    '  / {E}  {E} \\  ',
    '  |      |  ',
    '  ~`~``~`~  ',
  ],
  axolotl: [
    '}~(______)~{',
    '}~({E} .. {E})~{',
    '  ( .--. )  ',
    '  (_/  \\_)  ',
  ],
  capybara: [
    '  n______n  ',
    ' ( {E}    {E} ) ',
    ' (   oo   ) ',
    '  `------´  ',
  ],
  cactus: [
    ' n  ____  n ',
    ' | |{E}  {E}| | ',
    ' |_|    |_| ',
    '   |    |   ',
  ],
  robot: [
    '   .[||].   ',
    '  [ {E}  {E} ]  ',
    '  [ ==== ]  ',
    '  `------´  ',
  ],
  rabbit: [
    '   (\\__/)   ',
    '  ( {E}  {E} )  ',
    ' =(  ..  )= ',
    '  (")__(")  ',
  ],
  mushroom: [
    ' .-o-OO-o-. ',
    '(__________)',
    '   |{E}  {E}|   ',
    '   |____|   ',
  ],
  chonk: [
    '  /\\    /\\  ',
    ' ( {E}    {E} ) ',
    ' (   ..   ) ',
    '  `------´  ',
  ]
};

const HAT_LINES = {
  crown: '    \\^^^/   ',
  tophat: '    [___]   ',
  propeller: '     -+-    ',
  halo: '    (   )   ',
  wizard: '     /^\\    ',
  beanie: '    (___)   ',
  tinyduck: '     ,>     ',
};

const SPECIES = Object.keys(BODIES);

function sanitize(str) {
  // 把 {E} 替换为 ✦
  // 因为 {E} 占 3 个字符，✦ 占 1 个字符，这会使得字符串长度减少 2
  // 为了保证原有设计的对齐，我们在替换的位置后面或者字符串末尾不需要补空格
  // 因为在原本的 src/buddy/sprites.ts 中，作者就是在字符串里写死 {E} 并且故意让它占据 3 个位置
  // 然后在运行时使用 line.replaceAll('{E}', eye) 的。
  // 所以我们只要直接替换，并且保留原本字符串结构即可！
  return str.replace(/\{E\}/g, '✦');
}

let output = '';
const columns = 6;

for (let i = 0; i < SPECIES.length; i += columns) {
  const rowItems = SPECIES.slice(i, i + columns);
  
  // 名字行
  const nameRow = rowItems.map(item => item.padEnd(16, ' ')).join('');
  output += nameRow + '\n';
  
  // 图案行 (每个动物固定 4 行高度)
  for (let lineIdx = 0; lineIdx < 4; lineIdx++) {
    let lineStr = '';
    for (const item of rowItems) {
      let frameLine = BODIES[item][lineIdx] || '            ';
      // 进行替换，由于原本就是 12 字符宽的预设计，直接拼接
      frameLine = sanitize(frameLine);
      
      // 这里的 padding 必须非常小心
      // 由于我们知道每一个图的设计都是 12 宽左右
      // 我们可以用一个粗暴的办法：保留原始字符串字面量的内容！
      lineStr += frameLine + '    ';
    }
    output += lineStr.trimEnd() + '\n';
  }
  output += '\n';
}

const hats = Object.keys(HAT_LINES);
let hatOutput = '';
for (let i = 0; i < hats.length; i += columns) {
  const rowItems = hats.slice(i, i + columns);
  const nameRow = rowItems.map(item => item.padEnd(16, ' ')).join('');
  hatOutput += nameRow + '\n';
  
  let lineStr = '';
  for (const item of rowItems) {
    lineStr += HAT_LINES[item] + '    ';
  }
  hatOutput += lineStr.trimEnd() + '\n\n';
}


const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');

const newPetText = `  \`\`\`text\n${output.trimEnd()}\n  \`\`\``;
const newHatText = `  - 支持 **7 种帽子** (展示如下):\n    \`\`\`text\n${hatOutput.trimEnd()}\n    \`\`\``;

readme = readme.replace(/```text\nduck[\s\S]*?`------´\s*\n\s*```/m, newPetText.trim());

// 替换帽子部分，删掉带有帽子的动物身体展示，只保留帽子
readme = readme.replace(/- \*\*🎩 自由换装系统\*\*:\n\n\s*- 支持 \*\*8 种帽子\*\*:\n\s*```text[\s\S]*?`------´\s*\n\s*```/m, `- **🎩 自由换装系统**:\n\n${newHatText}`);


fs.writeFileSync(readmePath, readme, 'utf8');
console.log('README updated exactly with original raw string alignment!');