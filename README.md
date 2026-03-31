# Claude Code Source - Buildable Research Fork

> **可编译、可修改、可运行**的 Claude Code 源码研究版本。

基于 2026-03-31 通过 npm source map 公开暴露的 Claude Code 源码快照，经过完整的依赖反推和构建修复，使其可以编译和运行。

---

## What's Different from the Original Snapshot

原始快照（[beita6969/claude-code](https://github.com/beita6969/claude-code)）仅包含裸源码，**无法编译运行**。本仓库做了以下修复：

### Build System Reconstruction

| File | Purpose |
|------|---------|
| `package.json` | **从 1900 个源文件中反推出 60+ npm 依赖**及其版本 |
| `tsconfig.json` | TypeScript 编译配置（ESNext + JSX + Bun runtime） |
| `bunfig.toml` | Bun 运行时配置 |
| `.gitignore` | 排除 node_modules/dist 等 |

### Stub Modules for Internal/Missing Components

原始源码中有大量 **Anthropic 内部私有包**和**被 feature flag 保护的缺失模块**。我们为所有缺失组件创建了最小化 stub：

| Category | Count | Description |
|----------|-------|-------------|
| **Anthropic internal packages** (`@ant/*`) | 4 | computer-use-mcp, computer-use-swift, computer-use-input, claude-for-chrome-mcp |
| **Native addons** | 3 | color-diff-napi, audio-capture-napi, modifiers-napi |
| **Cloud provider SDKs** | 6 | Bedrock/Foundry/Vertex SDK, AWS STS, Azure Identity (stubbed to avoid heavy downloads) |
| **OpenTelemetry exporters** | 10 | OTLP gRPC/HTTP/Proto exporters (stubbed) |
| **Other optional packages** | 2 | sharp (image processing), turndown (HTML-to-MD) |
| **Feature-gated source modules** | ~90 | Tools, commands, services, components that were excluded from the source map |

### Source Code Fixes

| File | Change |
|------|--------|
| `src/main.tsx` | Added runtime `MACRO` constant injection (compile-time in production) |
| `src/main.tsx` | Fixed Commander.js `-d2e` short flag incompatibility |
| `src/bootstrap/state.ts` | Added missing `isReplBridgeActive()` export |
| `src/types/connectorText.ts` | Added `isConnectorTextBlock` function |
| `src/tools/WorkflowTool/constants.ts` | Added `WORKFLOW_TOOL_NAME` export |
| `node_modules/bundle/` | Runtime polyfill for `bun:bundle` feature flag system |

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.x
- Valid Anthropic authentication (OAuth via `claude login` or `ANTHROPIC_API_KEY`)

### Install & Build

```bash
# Clone
git clone https://github.com/beita6969/claude-code.git
cd claude-code

# Install dependencies
bun install

# Build (produces dist/main.js, ~20MB)
bun build src/main.tsx --outdir=dist --target=bun
```

### Run

```bash
# Headless print mode (no TTY needed)
bun src/main.tsx -p "your prompt here" --output-format text

# JSON output
bun src/main.tsx -p "your prompt here" --output-format json

# Interactive REPL mode (needs TTY)
bun src/main.tsx
```

> **Note**: If you have `ANTHROPIC_API_KEY` set in your environment, make sure it is valid. Otherwise unset it to use OAuth authentication:
> ```bash
> unset ANTHROPIC_API_KEY
> ```

---

## Architecture Overview

```
src/
├── main.tsx              # CLI entrypoint (Commander.js + React/Ink)
├── QueryEngine.ts        # Core LLM API engine
├── query.ts              # Agentic loop (async generator)
├── Tool.ts               # Tool type definitions
├── tools.ts              # Tool registry
├── commands.ts           # Command registry
├── context.ts            # System prompt context
│
├── tools/                # 40+ tool implementations
│   ├── AgentTool/        # Sub-agent spawning & coordination
│   ├── BashTool/         # Shell command execution
│   ├── FileReadTool/     # File reading
│   ├── FileEditTool/     # File editing
│   ├── GrepTool/         # ripgrep-based search
│   ├── MCPTool/          # MCP server tool invocation
│   ├── SkillTool/        # Skill execution
│   └── ...
│
├── services/             # External integrations
│   ├── api/              # Anthropic API client
│   ├── mcp/              # MCP server management
│   └── ...
│
├── memdir/               # Persistent memory system
├── skills/               # Skill system (bundled + user)
├── components/           # React/Ink terminal UI
├── hooks/                # React hooks
├── coordinator/          # Multi-agent orchestration
└── stubs/                # Stub packages for missing internals
```

### Key Systems

| System | Files | Description |
|--------|-------|-------------|
| **Agentic Loop** | `query.ts`, `QueryEngine.ts` | `while(true)` async generator: query -> tool calls -> results -> loop |
| **Memory** | `memdir/` | 4-type file-based memory (user/feedback/project/reference) with MEMORY.md index |
| **MCP** | `services/mcp/` | Model Context Protocol server management (stdio/http/sse/ws) |
| **Skills** | `skills/`, `tools/SkillTool/` | Reusable workflow templates (SKILL.md format) |
| **Agents** | `tools/AgentTool/` | Custom agent types via `.claude/agents/*.md` |
| **System Prompt** | `constants/prompts.ts` | Layered prompt: static -> dynamic -> memory -> agent |

### Extension Points (No Source Modification Needed)

| Mechanism | Location | Format |
|-----------|----------|--------|
| Custom Skills | `.claude/skills/name/SKILL.md` | YAML frontmatter + Markdown |
| Custom Agents | `.claude/agents/name.md` | YAML frontmatter + Markdown |
| MCP Servers | `.mcp.json` | JSON config |
| Hooks | `~/.claude/settings.json` | JSON event-action mappings |

---

## Feature Flags

The `bun:bundle` `feature()` function controls feature gating. In this research build, all features default to **disabled**. To enable features, edit `node_modules/bundle/index.js`:

```javascript
const ENABLED_FEATURES = new Set([
  // Uncomment to enable:
  // 'KAIROS',              // Assistant mode
  // 'PROACTIVE',           // Proactive mode
  // 'BRIDGE_MODE',         // IDE bridge
  // 'VOICE_MODE',          // Voice input
  // 'COORDINATOR_MODE',    // Multi-agent coordinator
  // 'EXTRACT_MEMORIES',    // Background memory extraction
  // 'TEAMMEM',             // Team memory
])
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Bun |
| Language | TypeScript (strict) |
| Terminal UI | React + Ink |
| CLI | Commander.js |
| Validation | Zod v4 |
| Search | ripgrep |
| Protocols | MCP SDK, LSP |
| API | Anthropic SDK |
| Telemetry | OpenTelemetry |

---

## Scale

- **~1,900 source files**
- **512,000+ lines of TypeScript**
- **40+ tools**, **100+ commands**, **140+ UI components**
- **20MB** compiled bundle

---

## Disclaimer

- This repository is for **educational and research purposes only**.
- The original Claude Code source is the property of **Anthropic**.
- This repository is **not affiliated with, endorsed by, or maintained by Anthropic**.
- Original source exposure identified on 2026-03-31 via npm source map leak.
