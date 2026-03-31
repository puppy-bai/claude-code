# Claude Code (研究版) 完整构建与安装教程

**源码仓库**: [https://github.com/beita6969/claude-code](https://github.com/beita6969/claude-code)

本教程旨在指导您在 Windows 环境下从零开始构建、安装并成功运行 Claude Code。

---

## 1. 环境准备 (Environment Setup)

项目核心依赖 **Bun** 运行时。

1. **安装 Bun**:
   在 PowerShell 中运行以下命令：
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```
2. **验证安装**:
   ```powershell
   bun --version
   ```

---

## 2. 依赖安装 (Dependency Installation)

1. **进入项目目录**:
   确保你处于包含 `package.json` 的文件夹下。
2. **执行安装**:
   由于 Windows 兼容性问题，必须跳过项目自带的 postinstall 脚本：
   ```powershell
   bun install --ignore-scripts
   ```

---

## 3. 核心修复步骤 (Critical Fixes)

必须手动修改以下三个文件，否则程序将无法启动或在运行时崩溃。

### A. 补全 ColorDiff 缺失方法

* **文件路径**: `src/stubs/ant-packages/color-diff-napi/index.js`
* **操作**: 将文件内容替换为以下代码：
  ```javascript
  export class ColorDiff { 
    constructor() {}
    diff() { return [] } 
    render() { return [] } // 必须补全，防止 UI 渲染崩溃
  }
  export class ColorFile {
    constructor() {}
    render() { return [] }
  }
  export function getSyntaxTheme() { return {} }
  ```

### B. 注入全局宏定义 (MACRO)

* **文件路径**: `src/entrypoints/cli.tsx`
* **操作**: 在所有 `import` 语句之后的**第一行**插入以下代码：
  ```typescript
  if (typeof globalThis.MACRO === 'undefined') {
    (globalThis as any).MACRO = {
      VERSION: '2.1.87',
      BUILD_TIME: new Date().toISOString(),
      PACKAGE_URL: '@anthropic-ai/claude-code',
      FEEDBACK_CHANNEL: '#claude-code-research',
      ISSUES_EXPLAINER: 'https://github.com/beita6969/claude-code/issues',
    };
  }
  ```

### C. 修正调试检测逻辑

* **文件路径**: `src/main.tsx`
* **操作**: 找到 `function isBeingDebugged()`，将其修改为：
  ```typescript
  function isBeingDebugged() {
    const isBun = isRunningWithBun();
    const hasInspectArg = process.execArgv.some(arg => /--inspect(-brk)?/.test(arg));
    const hasInspectEnv = process.env.NODE_OPTIONS && /--inspect(-brk)?/.test(process.env.NODE_OPTIONS);
    try {
      const inspector = (global as any).require ? (global as any).require('inspector') : null;
      const hasInspectorUrl = inspector ? !!inspector.url() : false;
      return hasInspectorUrl || hasInspectArg || !!hasInspectEnv;
    } catch {
      return hasInspectArg || !!hasInspectEnv;
    }
  }
  ```

---

## 4. 构建与运行 (Build & Run)

1. **正式构建**:
   ```powershell
   bun run build
   ```
2. **启动开发版**:
   ```powershell
   bun run dev
   ```

---

## 5. 常见问题 (Troubleshooting)

* **Unable to connect to Anthropic services**:

  * **原因**: 启动时的网络预检失败。
  * **解决**: 在 PowerShell 中设置代理：
    ```powershell
    $env:HTTP_PROXY="http://127.0.0.1:您的代理端口"
    $env:HTTPS_PROXY="http://127.0.0.1:您的代理端口"
    ```
* **ColorDiff...render is not a function**:

  * **检查**: 请重新确认步骤 3.A 是否已正确保存。
