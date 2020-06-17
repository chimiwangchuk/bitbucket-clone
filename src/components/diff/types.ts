import { ReactNode } from 'react';

export type LineType = 'normal' | 'add' | 'del' | 'empty' | 'loaded';

export type ConflictType = 'marker' | 'content';

export type Line = {
  oldLine?: number;
  newLine?: number;
  type: LineType;
  content: string;
  wordDiff?: string;
  position?: number;
  conflictType?: ConflictType;
  // Unused fields returned from diffparser
  add?: boolean;
  normal?: boolean;
  del?: boolean;
};

// Let's specify what kind of string we expect
export type DiffContext = string;

export type OnAddCommentArgs = {
  from: number | undefined;
  to: number | undefined;
};

export type OnAddComment = (lines: OnAddCommentArgs) => void;

export type OnShowMoreLines = (expanderIndex: number) => void;

export type IntlMessages = { addComment: string };

export type LoadedContent = {
  hasMoreLines: boolean;
  isLoading?: boolean;
};

export type ChunkEntry = {
  id: string;
  newStart: number;
  oldStart: number;
  newLines: number;
  oldLines: number;
  content: DiffContext;
  changes: Line[];
  extra: {
    before: LoadedContent;
    after: LoadedContent;
  };
  isDummyChunk?: boolean;
};

export type DiffEntry = {
  chunks: ChunkEntry[];
};

export type DiffContent = {
  lineFrom?: number;
  lineTo?: number;
  content: string;
};

export type DiffInlineRenderProp = (content: DiffContent) => ReactNode;

export type ChunkReducerAccumulator = {
  before: ChunkEntry;
  after: ChunkEntry;
};

export type ChangeReducerAccumulator = {
  before: Line[];
  after: Line[];
};

export type HideLines = {
  hideNewLines?: boolean;
  hideOldLines?: boolean;
};

export type GroupChangeAccumulator = {
  loadedBefore: Line[];
  loadedAfter: Line[];
  rest: Line[];
};

export enum LineAnnotationAnnotationType {
  Bug = 'BUG',
  CodeSmell = 'CODE_SMELL',
  Vulnerability = 'VULNERABILITY',
}

export enum LineAnnotationResult {
  Failed = 'FAILED',
  Ignored = 'IGNORED',
  Passed = 'PASSED',
  Skipped = 'SKIPPED',
}

export enum LineAnnotationSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
}

export type LineAnnotation = {
  annotation_type?: LineAnnotationAnnotationType;
  created_on?: string;
  details?: string;
  external_id: string;
  line?: number;
  link?: string;
  path?: string;
  result?: LineAnnotationResult;
  severity?: LineAnnotationSeverity;
  summary: string;
  type: string;
  updated_on?: string;
  uuid: string;
};
