import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
import { colors } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { Expander } from 'src/components/sidebar';
import {
  getCurrentCodeInsightsReports,
  getCurrentCodeInsightsReportsLoadingState,
  getHasCodeInsightsReportsError,
  getIsPipelinesEnabled,
  getCodeInsightsDiscoveryUrl,
  getCodeInsightsPipelinesUrl,
  getIsPipelinesPremium,
} from 'src/redux/pull-request/selectors';
import { fetchIsPipelinesEnabled } from 'src/redux/pull-request/actions/fetch-code-insights';
import { CodeInsightsResultType } from 'src/types/code-insights';
import { useIntl } from 'src/hooks/intl';
import { fetchCodeInsights } from 'src/redux/pull-request/actions';
import { getCurrentUser } from 'src/selectors/user-selectors';
import {
  publishUiEvent,
  publishScreenEvent,
} from 'src/utils/analytics/publish';
import urls from 'src/urls';
import CodeInsightsCardItem from './code-insights-card-item';
import CodeInsightsModal from './code-insights-modal';
import messages from './code-insights.i18n';
import {
  EmptyStateWrapper,
  EmptyStateImage,
  EmptyStateMessage,
  EmptyStateLearnMore,
} from './code-insights.style';
import emptyStateImageUrl from './code-insights-empty-state.png';

export const FREE_REPORTS_LIMIT = 3;

export const EmptyState: React.FC<{
  isPipelinesEnabled: boolean;
  discoveryUrl: string;
  pipelinesUrl: string;
}> = ({ isPipelinesEnabled, discoveryUrl, pipelinesUrl }) => {
  const intl = useIntl();

  return (
    <EmptyStateWrapper>
      <EmptyStateImage
        src={emptyStateImageUrl}
        alt={intl.formatMessage(messages.emptyStateImage)}
      />
      <EmptyStateMessage>
        {intl.formatMessage(messages.emptyStateMessage)}{' '}
        <a
          href={urls.external.codeInsightsLearnMore}
          target="_blank"
          rel="nofollow"
        >
          {intl.formatMessage(messages.learnMore)}
        </a>
      </EmptyStateMessage>
      <EmptyStateLearnMore>
        {isPipelinesEnabled ? (
          <Button
            appearance="link"
            href={discoveryUrl}
            target="_blank"
            rel="nofollow"
            onClick={() =>
              publishUiEvent({
                action: 'clicked',
                actionSubject: 'button',
                source: 'codeInsightsCard',
                actionSubjectId: 'emptyStatePipelinesEnabledButton',
              })
            }
          >
            {intl.formatMessage(messages.emptyStateDiscoveryLearnMore)}
          </Button>
        ) : (
          <Button
            appearance="link"
            href={pipelinesUrl}
            target="_blank"
            rel="nofollow"
            onClick={() =>
              publishUiEvent({
                action: 'clicked',
                actionSubject: 'button',
                source: 'codeInsightsCard',
                actionSubjectId: 'emptyStatePipelinesDisabledButton',
              })
            }
          >
            {intl.formatMessage(messages.emptyStatePipelinesLearnMore)}
          </Button>
        )}
      </EmptyStateLearnMore>
    </EmptyStateWrapper>
  );
};

const CodeInsightsCard: React.FC<{
  isCollapsed?: boolean;
}> = ({ isCollapsed }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  let codeInsightsReports = useSelector(getCurrentCodeInsightsReports);
  const isLoading = useSelector(getCurrentCodeInsightsReportsLoadingState);
  const isPipelinesEnabled = useSelector(getIsPipelinesEnabled);
  const isPipelinesPremium = useSelector(getIsPipelinesPremium);
  const hasError = useSelector(getHasCodeInsightsReportsError);
  const hasUser = !!useSelector(getCurrentUser);
  const discoveryUrl = useSelector(getCodeInsightsDiscoveryUrl);
  const pipelinesUrl = useSelector(getCodeInsightsPipelinesUrl);

  const hasReportWithError = codeInsightsReports.some(report => {
    return report.result === CodeInsightsResultType.Failed;
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);

  useEffect(() => {
    if (hasUser) {
      dispatch(fetchIsPipelinesEnabled());
      dispatch(fetchCodeInsights());
    }
  }, [dispatch, hasUser]);

  // deliberately do not show reports on fetch failures
  if (hasError || !hasUser) {
    return null;
  }

  // mark "locked" reports for free users (soft limit)
  codeInsightsReports = codeInsightsReports.map((report, i) => ({
    ...report,
    is_locked: !isPipelinesPremium && i + 1 > FREE_REPORTS_LIMIT,
  }));

  if (isCollapsed) {
    return (
      <Tooltip position="left" content={intl.formatMessage(messages.label)}>
        <Button
          appearance="subtle"
          iconBefore={
            <DashboardIcon label={intl.formatMessage(messages.label)} />
          }
        />
      </Tooltip>
    );
  }

  return (
    <Expander
      icon={<DashboardIcon label={intl.formatMessage(messages.label)} />}
      defaultIsCollapsed
      isLoading={isLoading}
      onChange={change =>
        !change.isCollapsed &&
        publishScreenEvent('codeInsightsCard', {
          reports: codeInsightsReports.length,
          passedReports: codeInsightsReports.filter(
            report => report.result === CodeInsightsResultType.Passed
          ).length,
          failedReports: codeInsightsReports.filter(
            report => report.result === CodeInsightsResultType.Failed
          ).length,
        })
      }
      label={
        codeInsightsReports.length === 0 ? (
          <>
            {intl.formatMessage(messages.label)}{' '}
            <Lozenge appearance="new">
              {intl.formatMessage(messages.new)}
            </Lozenge>
          </>
        ) : (
          <FormattedMessage
            {...messages.header}
            values={{
              total: codeInsightsReports.length,
              formattedCount: <strong>{codeInsightsReports.length}</strong>,
            }}
          />
        )
      }
      ariaLabel={intl.formatMessage(messages.label)}
      iconSecondary={
        hasReportWithError ? (
          <Tooltip
            position="bottom"
            content={intl.formatMessage(messages.labelError)}
          >
            <FailedBuildStatusIcon
              label={intl.formatMessage(messages.failedResultIcon)}
              primaryColor={colors.R400}
            />
          </Tooltip>
        ) : (
          undefined
        )
      }
    >
      {codeInsightsReports.length ? (
        codeInsightsReports.map((report, i) => (
          <CodeInsightsCardItem
            codeInsightsReport={report}
            openDialogWithSelectedReport={() => {
              setDialogOpen(true);
              setSelectedReportIndex(i);
              publishUiEvent({
                action: 'clicked',
                actionSubject: 'button',
                source: 'codeInsightsCard',
                actionSubjectId: 'selectReportButton',
              });
            }}
            key={`code-insights-item-${i}`}
          />
        ))
      ) : (
        <EmptyState
          isPipelinesEnabled={isPipelinesEnabled}
          discoveryUrl={discoveryUrl}
          pipelinesUrl={pipelinesUrl}
        />
      )}
      <ModalTransition>
        {isDialogOpen && (
          <CodeInsightsModal
            codeInsightsReports={codeInsightsReports}
            selectedReportIndex={selectedReportIndex}
            setSelectedReport={setSelectedReportIndex}
            closeDialog={() => setDialogOpen(false)}
          />
        )}
      </ModalTransition>
    </Expander>
  );
};

export default React.memo(CodeInsightsCard);
