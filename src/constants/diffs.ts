export const EXCESSIVE_DIFF_FILE_COUNT = 200; // > p99
export const EXCESSIVE_DIFF_LINE_COUNT = 8000; // > p97

// These single file mode specific limits will be removed in COREX-2239
// when the file tree is virtualized. The purpose of these high limits
// is to avoid the file tree being truncated in single file mode.
export const SINGLE_FILE_MODE_EXCESSIVE_DIFF_FILE_COUNT = 999;
export const SINGLE_FILE_MODE_EXCESSIVE_DIFF_LINE_COUNT = 20000;

// How large (in bytes) a file diff can be before it gets hidden (100Kb).
export const EXCESSIVE_DIFF_FILE_SIZE_BYTES = 102400;
export const EXCESSIVE_DIFF_FILE_SIZE_LINES = 2000;

// This value will be moved into the server-provided config as part of the Single File Mode
// project, just setting to an existing value for now. There are still open
// questions around how this threshold is going to interact with the other thresholds
// defined above.
export const SINGLE_FILE_MODE_THRESHOLD_LINES = 8000;
