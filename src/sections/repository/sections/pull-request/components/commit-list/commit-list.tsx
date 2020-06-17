import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { PanelStateless } from '@atlaskit/panel';
import { colors } from '@atlaskit/theme';
import GenericMessage from '@atlassian/bitbucket-generic-message';
import { BucketState } from 'src/types/state';
import Actions from 'src/redux/pr-commits/actions';
import { Commit as CommitType } from 'src/components/types';
import { CommitList as SharedCommitList } from 'src/containers/commit-list';
import * as styles from 'src/sections/global/components/page.style';
import Loading from 'src/components/loading';
import { useIntl } from 'src/hooks/intl';
import { getPullRequestCommitsState } from 'src/redux/pr-commits/selectors';
import common from 'src/i18n/common';
import SyncBranchDialog from 'src/sections/repository/sections/branches/containers/sync-branch-dialog';
import messages from './commit-list.i18n';

import BranchSyncInfo from './branch-sync-info';
import * as commitStyles from './commit-list.style';

type StateProps = {
  isLoading: boolean;
  hasError: boolean;
  commits: CommitType[];
  hasMore: boolean;
  errorMessage?: string;
};

type Props = StateProps;

const CommitCountMessage = ({
  commits,
  hasMore,
  hasError,
}: {
  commits?: number;
  hasMore: boolean;
  hasError: boolean;
}) => (
  <commitStyles.PanelHeader>
    <strong>
      <FormattedMessage
        {...messages.commitListTitle}
        values={{
          hasError: hasError.toString(),
          hasMore: hasMore.toString(),
          count: commits || 0,
        }}
      />
    </strong>
    {hasError && (
      <Tooltip
        tag="span"
        content={<FormattedMessage {...messages.commitListGenericError} />}
      >
        <WarningIcon primaryColor={colors.Y300} label="" />
      </Tooltip>
    )}
  </commitStyles.PanelHeader>
);

const CommitLoadingMessage = () => (
  <styles.PanelHeader>
    <FormattedMessage {...messages.commitListLoading} />
  </styles.PanelHeader>
);

export const LoadMoreButton = ({ isLoading }: { isLoading?: boolean }) => {
  const dispatch = useDispatch();

  return (
    <Button
      isLoading={isLoading}
      appearance="subtle"
      onClick={() => dispatch({ type: Actions.FETCH_MORE_COMMITS })}
      theme={(currentTheme, props) => ({
        ...currentTheme(props),
        buttonStyles: {
          ...currentTheme(props).buttonStyles,
          display: 'block',
          margin: '0 auto',
        },
      })}
    >
      <FormattedMessage {...messages.commitListLoadMore} />
    </Button>
  );
};

export const BaseCommitList = ({
  commits = [],
  isLoading = true,
  hasError = false,
  hasMore = false,
}: Props) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const Header = isLoading ? (
    <CommitLoadingMessage />
  ) : (
    <commitStyles.PanelHeaderWrapper>
      <CommitCountMessage
        commits={commits.length}
        hasMore={hasMore}
        hasError={hasError}
      />
      {!isPanelExpanded && (
        <commitStyles.BranchSyncInfoWrapper>
          <BranchSyncInfo appearance="inline" />
        </commitStyles.BranchSyncInfoWrapper>
      )}
    </commitStyles.PanelHeaderWrapper>
  );

  return (
    <styles.PageSection
      data-qa="pr-commit-list-styles"
      aria-label={intl.formatMessage(messages.commitListLabel)}
    >
      <PanelStateless
        header={Header}
        isExpanded={isPanelExpanded}
        onChange={setIsPanelExpanded}
      >
        {commits.length > 0 && (
          <commitStyles.CommitListWrapper>
            <BranchSyncInfo />
            <SyncBranchDialog />
            <SharedCommitList commits={commits} />
          </commitStyles.CommitListWrapper>
        )}

        {/* This happens during initial load while we're unsure if we have more yet. */}
        {isLoading && !hasMore && <Loading />}

        {hasMore && <LoadMoreButton isLoading={isLoading} />}

        {hasError && !isLoading && (
          <GenericMessage
            iconType="warning"
            title={<FormattedMessage {...common.errorHeading} />}
          >
            <Button
              appearance="link"
              onClick={() => dispatch({ type: Actions.RETRY_COMMITS })}
            >
              <FormattedMessage {...common.tryAgain} />
            </Button>
          </GenericMessage>
        )}
      </PanelStateless>
    </styles.PageSection>
  );
};

const mapStateToProps = (state: BucketState): StateProps => {
  const { commits, hasError, isLoading, nextUrl } = getPullRequestCommitsState(
    state
  );

  return {
    commits: commits || [],
    hasError,
    isLoading,
    hasMore: !!nextUrl,
  };
};

export default connect(mapStateToProps)(BaseCommitList);
