export let lastInputTime = Date.now();
export let lastCommandResult: 'success' | 'failure' | null = null;
export let lastCommandErrorMsg: string | null = null;
export let lastCommandTime = 0;
export let lastCommandDurationMs = 0;
export let experienceAwardedForLastCommand = true;
// Track previous state for bug fixing logic (DEBUGGING)
export let previousCommandResult: 'success' | 'failure' | null = null;

export function updateLastInputTime() {
  lastInputTime = Date.now();
}

export function getIdleTime() {
  return Date.now() - lastInputTime;
}

export function markExperienceAwarded() {
  experienceAwardedForLastCommand = true;
}

export function reportCommandResult(success: boolean, errorMsg?: string, durationMs?: number) {
  previousCommandResult = lastCommandResult;
  lastCommandResult = success ? 'success' : 'failure';
  lastCommandErrorMsg = errorMsg || null;
  lastCommandTime = Date.now();
  lastCommandDurationMs = durationMs || 0;
  experienceAwardedForLastCommand = false;
}
