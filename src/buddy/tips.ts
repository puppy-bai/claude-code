export const PET_TIPS = [
  "💡 提示：使用 ctrl+r 可以在终端里搜索历史命令哦！",
  "💡 提示：git commit --amend 可以修改上一次的提交。",
  "💡 提示：敲代码久了，记得站起来活动一下脖子！",
  "💡 提示：按 ctrl+l 可以快速清空终端屏幕。",
  "💡 提示：遇到奇怪的 Bug？试着重启一下服务或者清理缓存。",
  "💧 喝口水吧，你已经连续敲了很久代码了，保持水分充足能让大脑更灵活！",
  "👀 别忘了眨眨眼，保护视力很重要！",
  "💡 提示：git stash 是个好东西，可以暂存当前未提交的修改。",
  "💡 提示：在 Bash 中，!! 可以重复执行上一条命令。",
  "💡 提示：试试 ctrl+a 移动光标到行首，ctrl+e 到行尾。",
  "💡 提示：使用 git log --oneline --graph 可以查看精简版的提交记录！",
  "💡 提示：在终端中，ctrl+w 可以删除光标前的一个单词。",
  "🌱 站起来走走吧，说不定 Bug 的灵感就在泡咖啡的路上！",
  "💡 提示：git cherry-pick 可以把其他分支的特定提交摘取过来。"
];

export function getRandomTip(): string {
  return PET_TIPS[Math.floor(Math.random() * PET_TIPS.length)];
}
