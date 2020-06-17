import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  getViewEntireFileParsedDiffFile,
  getIsViewEntireFileTooLarge,
  getViewEntireFileHasError,
  getIsViewEntireFileLoading,
  getViewEntireFilePath,
  closeViewEntireFileDialog,
} from 'src/redux/pull-request/view-entire-file-reducer';

export const useViewEntireFileState = () => {
  const dispatch = useDispatch();

  const diffFile = useSelector(getViewEntireFileParsedDiffFile);
  const isTooLarge = useSelector(getIsViewEntireFileTooLarge);
  const hasError = useSelector(getViewEntireFileHasError);
  const isLoading = useSelector(getIsViewEntireFileLoading);
  const path = useSelector(getViewEntireFilePath);

  const handleClose = useCallback(() => dispatch(closeViewEntireFileDialog()), [
    dispatch,
  ]);

  return { diffFile, isTooLarge, hasError, isLoading, path, handleClose };
};
