// Runtime polyfill for bun:bundle feature() function
// In production builds, Bun resolves these at compile time to enable dead code elimination.
// For our research build, all features default to false (disabled).
const ENABLED_FEATURES = new Set<string>([
  // Core features we want enabled for basic functionality:
  // 'KAIROS',              // Assistant mode
  // 'PROACTIVE',           // Proactive mode
  // 'BRIDGE_MODE',         // IDE bridge
  // 'VOICE_MODE',          // Voice input
  // 'COORDINATOR_MODE',    // Multi-agent coordinator
  // 'TRANSCRIPT_CLASSIFIER', // Auto-mode classifier
  // 'BUDDY',               // Companion sprite
  // 'WEB_BROWSER_TOOL',    // Web browser tool
  // 'CHICAGO_MCP',         // Computer use MCP
  // 'DAEMON',              // Daemon mode
])

export function feature(name: string): boolean {
  return ENABLED_FEATURES.has(name)
}
