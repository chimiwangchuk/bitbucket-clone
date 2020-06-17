import React, { Fragment, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { useIntl } from 'src/hooks/intl';
import { getFileTree } from 'src/selectors/file-tree-selectors';
import { flattenFiles } from 'src/components/file-tree/src/flatten-directories';
import { TreeEntry } from 'src/components/file-tree/src/types';
import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';
import { scrollToAnchor } from 'src/redux/pull-request/actions';
import { getActiveDiff } from 'src/redux/pull-request/selectors';
import messages from './single-file-navigation.i18n';
import * as styles from './single-file-navigation.style';

const BaseSingleFileNavigation = () => {
  const [fileHrefs, setFileHrefs] = useState([] as string[]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const dispatch = useDispatch();
  const intl = useIntl();

  const activeDiff: string = useSelector(getActiveDiff);

  const fileTree: TreeEntry[] | null = useSelector(getFileTree);

  useEffect(() => {
    if (fileTree) {
      setFileHrefs(flattenFiles(fileTree));
    }
  }, [fileTree]);

  // when current active diff has been changed by file-tree/other means
  useEffect(() => {
    if (activeDiff) {
      const indexInFileArray = fileHrefs.findIndex(
        href => href.replace(/#/, '') === activeDiff
      );
      setIsFileSelected(false);
      setCurrentFileIndex(Math.max(0, indexInFileArray));
    }
  }, [activeDiff, fileHrefs]);

  // move to appropriate diff based on index of file
  useEffect(() => {
    if (isFileSelected) {
      const currFileHref = fileHrefs[currentFileIndex];
      if (currFileHref) {
        const anchorId = currFileHref.replace(/#/, '');
        dispatch(updateMobileHeaderState('none'));
        dispatch(scrollToAnchor(anchorId));
      }
    }
  }, [currentFileIndex, dispatch, fileHrefs, isFileSelected]);

  const handlePrevClick = useCallback(() => {
    setIsFileSelected(true);
    setCurrentFileIndex(currIndex => Math.max(0, currIndex - 1));
  }, []);
  const handleNextClick = useCallback(() => {
    setIsFileSelected(true);
    setCurrentFileIndex(currIndex =>
      Math.min(fileHrefs.length - 1, currIndex + 1)
    );
  }, [fileHrefs.length]);

  return (
    <Fragment>
      {fileHrefs && fileHrefs.length > 1 && (
        <Fragment>
          <styles.Container>
            <Tooltip content={intl.formatMessage(messages.previousFile)}>
              <Button
                aria-label={intl.formatMessage(messages.previousFile)}
                isDisabled={currentFileIndex === 0}
                onClick={handlePrevClick}
                iconBefore={
                  <ChevronLeftIcon
                    label={intl.formatMessage(messages.previousFile)}
                  />
                }
              />
            </Tooltip>
          </styles.Container>
          <styles.Container>
            <Tooltip content={intl.formatMessage(messages.nextFile)}>
              <Button
                aria-label={intl.formatMessage(messages.nextFile)}
                isDisabled={
                  fileHrefs && currentFileIndex === fileHrefs.length - 1
                }
                onClick={handleNextClick}
                iconBefore={
                  <ChevronRightIcon
                    label={intl.formatMessage(messages.nextFile)}
                  />
                }
              />
            </Tooltip>
          </styles.Container>
        </Fragment>
      )}
    </Fragment>
  );
};

export const SingleFileNavigation = React.memo(BaseSingleFileNavigation);
