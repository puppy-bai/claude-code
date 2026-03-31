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
git clone <你的仓库地址>
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

## 📂 项目结构概览

-   `src/entrypoints/cli.tsx`: 真正的 CLI 入口，处理环境初始化。
-   `src/main.tsx`: 核心业务逻辑与 Agent 循环。
-   `src/stubs/`: 存放所有缺失依赖的模拟实现（Stub）。
-   `BUILD_GUIDE.md`: 更详细的底层修改记录。

---
**免责声明**: 本项目仅供安全研究与教育目的使用。
