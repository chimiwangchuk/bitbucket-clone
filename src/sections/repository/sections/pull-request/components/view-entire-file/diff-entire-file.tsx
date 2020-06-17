import React, { Fragment, useRef } from 'react';
import Diff, { Line } from '@atlassian/bitkit-diff';

import { DiffScrollMap } from 'src/components/diff-scroll-map';
import { Diff as DiffType } from 'src/types/pull-request';
import { extractFilepath } from 'src/utils/extract-file-path';

import { useConversations } from '../../hooks/conversations';
import { useDiffPreferences as useDiffPreferencesDI } from '../../hooks/diffs';

import { DiffWrapper } from './styled';

const EMPTY_ARRAY: Array<Line> = [];

type Props = {
  diffFile: DiffType;
  useDiffPreferences?: typeof useDiffPreferencesDI;
};

const BaseDiffEntireFile: React.FC<Props> = ({
  diffFile,
  useDiffPreferences = useDiffPreferencesDI,
}) => {
  const editorPopupsMountPointRef = useRef(null);

  const filepath = extractFilepath(diffFile);

  const {
    discardCommentsModal,
    onAddInlineComment,
    renderInlineConversations,
  } = useConversations({ diff: diffFile, editorPopupsMountPointRef });

  const {
    isColorBlindModeEnabled,
    isWordWrapEnabled,
    isSideBySide,
  } = useDiffPreferences(diffFile);

  return (
    <Fragment>
      <DiffScrollMap
        // There should only be a single chunk since we have the entire file
        lines={diffFile.chunks[0]?.changes || EMPTY_ARRAY}
        isSideBySide={isSideBySide}
      >
        <DiffWrapper ref={editorPopupsMountPointRef}>
          <Diff
            diff={diffFile}
            filePath={filepath}
            inlineContent={renderInlineConversations}
            isColorBlindModeEnabled={isColorBlindModeEnabled}
            isSideBySide={isSideBySide}
            isWordWrapEnabled={isWordWrapEnabled}
            onAddComment={onAddInlineComment}
          />
        </DiffWrapper>
      </DiffScrollMap>
      {discardCommentsModal}
    </Fragment>
  );
};

export const DiffEntireFile = React.memo(BaseDiffEntireFile);
