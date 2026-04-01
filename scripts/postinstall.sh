#!/bin/bash
# Post-install script: creates the bun:bundle runtime polyfill
# In production Claude Code, bun:bundle is a compile-time module that gets resolved during bun build.
# For our research build, we provide a runtime polyfill that lets you toggle feature flags.

BUNDLE_DIR="node_modules/bundle"
mkdir -p "$BUNDLE_DIR"

cat > "$BUNDLE_DIR/package.json" << 'PKGJSON'
{"name":"bundle","version":"0.0.1","main":"index.js"}
PKGJSON

cat > "$BUNDLE_DIR/index.js" << 'BUNDLEJS'
// Runtime polyfill for bun:bundle feature() function
// In production, Bun resolves feature() at compile time for dead code elimination.
// Uncomment features below to enable them.

const ENABLED_FEATURES = new Set([
  // 'KAIROS',                // Assistant / daily-log mode
  // 'PROACTIVE',             // Proactive autonomous mode
  // 'BRIDGE_MODE',           // VS Code / JetBrains IDE bridge
  // 'VOICE_MODE',            // Voice input via native audio capture
  // 'COORDINATOR_MODE',      // Multi-agent swarm coordinator
  // 'TRANSCRIPT_CLASSIFIER', // Auto-mode permission classifier
  // 'BASH_CLASSIFIER',       // Bash command safety classifier
  'BUDDY',                 // Companion sprite animation
  // 'WEB_BROWSER_TOOL',      // In-process web browser tool
  // 'CHICAGO_MCP',           // Computer Use (screen control)
  // 'AGENT_TRIGGERS',        // Scheduled cron agents
  // 'ULTRAPLAN',             // Ultra-detailed planning mode
  // 'MONITOR_TOOL',          // MCP server monitoring
  // 'TEAMMEM',               // Shared team memory
  // 'EXTRACT_MEMORIES',      // Background memory extraction agent
  // 'MCP_SKILLS',            // Skills from MCP servers
  // 'REVIEW_ARTIFACT',       // Review artifact tool
  // 'CONNECTOR_TEXT',        // Connector text blocks
  // 'DOWNLOAD_USER_SETTINGS',// Remote settings sync
  // 'MESSAGE_ACTIONS',       // Message action buttons
  // 'KAIROS_CHANNELS',       // Channel notifications
  // 'KAIROS_GITHUB_WEBHOOKS',// GitHub webhook integration
])

module.exports.feature = function feature(name) {
  return ENABLED_FEATURES.has(name)
}
BUNDLEJS

echo "✅ bun:bundle polyfill installed at $BUNDLE_DIR/"
