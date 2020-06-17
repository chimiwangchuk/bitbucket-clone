import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SectionMessage from '@atlaskit/section-message';

import { useIntl } from 'src/hooks/intl';
import { getIsAsyncMergeInProgress } from 'src/redux/pull-request/merge-reducer';
import { BucketState } from 'src/types/state';

import messages from './async-merge-section.i18n';
import * as styles from './async-merge-section.style';

type AsyncMergeSectionProps = {
  isAsyncMergeInProgress: boolean;
};

export function AsyncMergeSection(props: AsyncMergeSectionProps) {
  const intl = useIntl();
  const { isAsyncMergeInProgress } = props;

  return isAsyncMergeInProgress ? (
    <styles.PaddedSection>
      <SectionMessage
        appearance="warning"
        title={intl.formatMessage(messages.title)}
      >
        {intl.formatMessage(messages.body)}
      </SectionMessage>
    </styles.PaddedSection>
  ) : null;
}

AsyncMergeSection.defaultProps = {
  isAsyncMergeInProgress: false,
};

function mapStateToProps(state: BucketState) {
  return {
    isAsyncMergeInProgress: getIsAsyncMergeInProgress(state),
  };
}

export default compose(connect(mapStateToProps), memo)(AsyncMergeSection);
