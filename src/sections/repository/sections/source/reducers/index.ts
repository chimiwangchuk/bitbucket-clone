import { combineReducers } from 'redux';

import file, { SourceFileState } from './file';
import section, { SourceSectionState } from './section';
import srcDirMetadata, { SourceDirMetadataState } from './src-dir-metadata';
import annotations, { AnnotationsState } from './annotations';

export type SourceState = {
  file: SourceFileState;
  section: SourceSectionState;
  srcDirMetadata: SourceDirMetadataState;
  annotations: AnnotationsState;
};

export default combineReducers({
  file,
  section,
  annotations,
  srcDirMetadata,
});
