import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import GenericMessage from 'src/components/generic-message';
import { Diff } from 'src/types/pull-request';
import LoadingSpinner from 'src/components/loading';
import CurrentDiffSet from '../containers/current-diff-set';
import PartialDiffMessage from '../containers/partial-diff-message';
import messages from './diff.i18n';
import { BrokenDiffMessage } from './broken-diff-message';

export type DiffLoaderProps = {
  files: Diff[] | null;
  isLoading: boolean;
  isTruncated?: boolean;
  isSingleFileModeActive?: boolean;
  errorCode?: string | number | null;
};

const DiffMessageContainer = styled.div`
  margin-bottom: ${gridSize() * 2}px;
`;

export const MissingDiffMessage = () => (
  <GenericMessage
    iconType="warning"
    title={<FormattedMessage {...messages.missingDiffsTitle} />}
  >
    <FormattedMessage tagName="p" {...messages.missingDiffs} />
  </GenericMessage>
);

export const NoFilesMessage = () => (
  <GenericMessage
    iconType="info"
    title={<FormattedMessage {...messages.noFilesTitle} />}
  >
    <FormattedMessage tagName="p" {...messages.noFiles} />
  </GenericMessage>
);

export default class DiffLoader extends Component<DiffLoaderProps> {
  render() {
    const {
      isLoading,
      isTruncated,
      isSingleFileModeActive,
      errorCode,
      files,
    } = this.props;

    const is400 = errorCode && `${errorCode}`.startsWith('4');
    const is500 = errorCode && `${errorCode}`.startsWith('5');

    if (isLoading) {
      return <LoadingSpinner size="medium" />;
    }

    if (is400) {
      return <MissingDiffMessage />;
    }

    if (is500) {
      return <BrokenDiffMessage />;
    }

    if (files && !files.length) {
      return <NoFilesMessage />;
    }

    return (
      <Fragment>
        {!isSingleFileModeActive && isTruncated && (
          <DiffMessageContainer>
            <PartialDiffMessage />
          </DiffMessageContainer>
        )}
        <CurrentDiffSet files={files} />
      </Fragment>
    );
  }
}
