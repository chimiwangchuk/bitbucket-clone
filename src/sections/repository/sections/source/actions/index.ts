import { createAsyncAction } from 'src/redux/actions';

export const FetchDirectory = createAsyncAction('source/FETCH_DIRECTORY');
export const FetchFileTree = createAsyncAction('source/FETCH_FILE_TREE');
export const FetchSource = createAsyncAction('source/FETCH_SOURCE');
export const FetchSourceDirMetadata = createAsyncAction(
  'source/FETCH_DIR_METADATA'
);
export const FetchSourceObjectMeta = createAsyncAction(
  'source/FETCH_SOURCE_OBJECT_META'
);
export const LOAD_SOURCE_FILE = 'source/LOAD_SOURCE_FILE';
export const LoadFileMeta = createAsyncAction('source/LOAD_FILE_META');
export const LoadFileContents = createAsyncAction('source/LOAD_FILE_CONTENTS');
export const LoadFileTree = createAsyncAction('source/LOAD_FILE_TREE');
export const LoadLfsInfo = createAsyncAction('source/LOAD_LFS_INFO');
export const LoadSourceObject = createAsyncAction('source/LOAD_SOURCE_OBJECT');

export const FilterFiles = createAsyncAction('source/FILTER_FILES');

export const FetchDiff = createAsyncAction('source/FETCH_DIFF');

export const LoadAnnotators = createAsyncAction('source/LOAD_ANNOTATORS');
export const LoadAnnotations = createAsyncAction('source/LOAD_ANNOTATIONS');

export const UNLOAD_DIFF = 'source/UNLOAD_DIFF';
export const UNLOAD_FILE = 'source/UNLOAD_FILE';
export const UNLOAD_SOURCE = 'source/UNLOAD_SOURCE';
