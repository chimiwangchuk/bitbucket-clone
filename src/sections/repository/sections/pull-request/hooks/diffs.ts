import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  ACTIVE_DIFF_PERMALINK,
  toggleSideBySideMode,
} from 'src/redux/pull-request/actions';
import {
  getActivePermalink,
  getCurrentPullRequestAnnotationsForFile,
  getSideBySideDiffStateForFile,
} from 'src/redux/pull-request/selectors';
import {
  getIsPrAnnotationsEnabled,
  getIsWordWrapEnabled,
} from 'src/selectors/feature-selectors';
import {
  getGlobalIsColorBlindModeEnabled,
  getGlobalIsAnnotationsEnabled,
  getGlobalDiffViewMode,
  DiffViewMode,
} from 'src/redux/pull-request-settings';
import { Diff as DiffType } from 'src/types/pull-request';
import { BucketState } from 'src/types/state';
import { extractFilepath } from 'src/utils/extract-file-path';

export const useAnnotations = (diff: DiffType) => {
  const isAnnotationModeActive = useSelector(getGlobalIsAnnotationsEnabled);
  const isAnnotationModeEnabled = useSelector(getIsPrAnnotationsEnabled);
  const isPrAnnotationsEnabled =
    isAnnotationModeActive && isAnnotationModeEnabled;
  const fileAnnotations = useSelector((state: BucketState) =>
    getCurrentPullRequestAnnotationsForFile(state, diff.to)
  );

  return {
    fileAnnotations: isPrAnnotationsEnabled ? fileAnnotations : undefined,
    isPrAnnotationsEnabled,
  };
};

export const useGlobalDiffPreferences = () => {
  const isColorBlindModeEnabled = useSelector(getGlobalIsColorBlindModeEnabled);
  const isSideBySide =
    useSelector(getGlobalDiffViewMode) === DiffViewMode.SideBySide;
  const isWordWrapEnabled = useSelector(getIsWordWrapEnabled);

  return {
    isColorBlindModeEnabled,
    isSideBySide,
    isWordWrapEnabled,
  };
};

export const useDiffPreferences = (diff: DiffType | null) => {
  const globalPreferences = useGlobalDiffPreferences();

  const dispatch = useDispatch();
  const path = diff && extractFilepath(diff);

  const isSideBySide = useSelector((state: BucketState) =>
    path
      ? getSideBySideDiffStateForFile(state, path)
      : globalPreferences.isSideBySide
  );

  const toggleIsSideBySide = useCallback(
    () =>
      path
        ? dispatch(
            toggleSideBySideMode({
              filePath: path,
              isSideBySide: !isSideBySide,
            })
          )
        : null,
    [dispatch, isSideBySide, path]
  );

  return {
    ...globalPreferences,
    isSideBySide,
    toggleIsSideBySide,
  };
};

export const usePermalinks = () => {
  const dispatch = useDispatch();
  const activePermalink = useSelector(getActivePermalink);
  const onPermalinkClick = useCallback(
    (permalink: string) =>
      dispatch({
        type: ACTIVE_DIFF_PERMALINK,
        payload: permalink,
      }),
    [dispatch]
  );

  return { activePermalink, onPermalinkClick, showPermalinks: true };
};
