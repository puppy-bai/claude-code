# Claude Code 启动器

这个目录包含用于快速启动 Claude Code Research Edition 的脚本。

## 快速开始

### 方法 1：直接双击启动（需要 Bun）

双击 `start-claude.bat` 即可启动 Claude Code。

**前提条件**：
- 已安装 Bun (https://bun.sh)

### 方法 2：构建独立可执行文件

如果你想创建一个独立的 `.exe` 文件（无需安装 Bun 即可运行）：

1. 双击 `build-executable.bat`
2. 等待构建完成
3. 运行生成的 `claude-code.exe`

**注意**：Bun 的 `--compile` 功能在 Windows 上的支持可能有限。如果失败，请使用方法 1。

### 方法 3：使用 PowerShell

```powershell
# 在 PowerShell 中运行
.\start-claude.ps1
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `start-claude.bat` | Windows 批处理启动脚本，双击即可运行 |
| `start-claude.ps1` | PowerShell 启动脚本，功能更丰富 |
| `build-executable.bat` | 构建独立可执行文件的脚本 |

## 安装 Bun

如果尚未安装 Bun，在 PowerShell 中运行：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

或者访问 https://bun.sh/ 获取安装说明。

## 故障排除

### "Bun is not installed"
- 确保 Bun 已正确安装
- 检查 Bun 是否在系统 PATH 中

### 构建失败
- 确保已运行 `bun install` 安装依赖
- 检查 Node.js/Bun 版本兼容性

### 运行时报错
- 检查 `src/entrypoints/cli.tsx` 是否存在
- 确保所有依赖已通过 `bun install` 安装
