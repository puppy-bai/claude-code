# Claude Code (Windows 可直接构建运行版)

> 本仓库是基于 2026-03-31 泄露的 Claude Code 源码进行的修复版本。
> **修复内容**：补全了所有缺失的构建配置、Stub 桩代码、Native 依赖模拟，并修正了 Windows 环境下的运行 Bug。

---

## 🚀 快速开始

任何人拿到此仓库，只需以下几步即可在 Windows 上运行：

### 1. 安装 Bun 运行时
项目高度依赖 [Bun](https://bun.sh)。在 PowerShell 中运行：
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. 下载并安装依赖
```powershell
git clone https://github.com/puppy-bai/claude-code
cd claude-code
bun install --ignore-scripts
```

### 3. 构建与运行
```powershell
# 构建正式版 (生成 dist/main.js)
bun run build

# 启动开发版交互界面
bun run dev
```

---

## 🛠️ 已修复的关键问题 (拿来即用)

为了确保“拿来即用”，本版本已预先完成了以下修复：

1.  **ColorDiff 崩溃修复**: 补全了 `src/stubs/ant-packages/color-diff-napi/index.js` 中的 `render` 方法，解决了 UI 渲染时的 `is not a function` 报错。
2.  **全局宏定义注入**: 在 `src/entrypoints/cli.tsx` 中自动注入了 `MACRO` 变量（版本号、构建时间等），防止运行时出现 `ReferenceError`。
3.  **调试检测优化**: 修正了 `src/main.tsx` 中的 `isBeingDebugged` 逻辑，解决了在 Windows/Bun 环境下可能导致的静默退出问题。
4.  **Windows 兼容性**: 优化了安装流程，避开了由于缺失 Bash 环境导致的 `postinstall` 脚本错误。

---

## ⚠️ 注意事项 (网络与 API)

-   **API Key**: 运行前请确保已设置环境变量 `ANTHROPIC_API_KEY`。
-   **网络代理**: 如果你在国内环境运行，启动时若提示 `Unable to connect to Anthropic services`，请在终端设置代理：
    ```powershell
    $env:HTTP_PROXY="http://127.0.0.1:您的代理端口"
    $env:HTTPS_PROXY="http://127.0.0.1:您的代理端口"
    ```
-   **强制跳过网络检查**: 如果需要彻底跳过启动时的域名预检，可修改 `src/utils/preflightChecks.tsx`，让 `checkEndpoints` 直接返回 `success: true`。

---

## 📂 项目结构与核心文件说明

### 1. 运行与构建文件
- **`dist/main.js`**: 构建后生成的最终可执行文件（约 20MB），包含所有依赖。可以直接通过 `bun dist/main.js` 运行。
- **`src/entrypoints/cli.tsx`**: CLI 入口，负责 `MACRO` 注入、环境初始化及启动核心逻辑。
- **`src/main.tsx`**: 核心 Agent 循环逻辑，管理对话流程与工具调用。

### 2. 关键系统模块
- **`src/QueryEngine.ts`**: 处理与 Anthropic API 的底层通信及上下文管理。
- **`src/tools/`**: 包含 40+ 自动化工具，如 `BashTool` (执行 Shell)、`FileEditTool` (精准代码编辑)。
- **`src/memdir/`**: 智能体内存系统，持久化存储项目知识和用户偏好。
- **`src/stubs/`**: **关键修复目录**，存放所有缺失原生依赖的模拟实现（Stub）。

### 3. 配置与脚本
- **`package.json`**: 定义了项目依赖、构建脚本（`build`）及开发启动脚本（`dev`）。
- **`bunfig.toml`**: Bun 运行时的专属配置文件。
- **`BUILD_GUIDE.md`**: 详尽的底层修复记录，记录了所有为了让泄露版跑起来所做的改动。

---
**免责声明**: 本项目仅供安全研究与教育目的使用。
