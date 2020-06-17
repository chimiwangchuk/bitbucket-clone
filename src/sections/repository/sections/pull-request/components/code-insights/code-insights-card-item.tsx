import React from 'react';
import FailedStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import PassedStatusIcon from '@atlaskit/icon/glyph/check-circle';
import PendingStatusIcon from '@atlaskit/icon/glyph/recent';
import PremiumIcon from '@atlaskit/icon/glyph/premium';
import { colors } from '@atlaskit/theme';
import { useIntl } from 'src/hooks/intl';
import {
  CodeInsightsResult,
  CodeInsightsResultType,
} from 'src/types/code-insights';
import messages from './code-insights.i18n';
import {
  UnknownIcon,
  CardItemWrapper,
  CardItemTitle,
} from './code-insights.style';

type Props = {
  codeInsightsReport: CodeInsightsResult;
  openDialogWithSelectedReport: () => void;
  isActive?: boolean;
  isModalView?: boolean;
};

const Icon: React.FC<{ report: CodeInsightsResult }> = ({ report }) => {
  const intl = useIntl();

  if (report.is_locked) {
    return (
      <PremiumIcon
        label={intl.formatMessage(messages.premiumResultIcon)}
        primaryColor={colors.B400}
        size="medium"
      />
    );
  }

  if (report.result === CodeInsightsResultType.Passed) {
    return (
      <PassedStatusIcon
        label={intl.formatMessage(messages.passedResultIcon)}
        primaryColor={colors.G300}
        size="medium"
      />
    );
  }

  if (report.result === CodeInsightsResultType.Failed) {
    return (
      <FailedStatusIcon
        label={intl.formatMessage(messages.failedResultIcon)}
        primaryColor={colors.R400}
        size="medium"
      />
    );
  }

  if (report.result === CodeInsightsResultType.Pending) {
    return (
      <PendingStatusIcon
        label={intl.formatMessage(messages.pendingResultIcon)}
        primaryColor={colors.B300}
        size="medium"
      />
    );
  }

  return <UnknownIcon title={intl.formatMessage(messages.unknownResultIcon)} />;
};

const CodeInsightsCardItem: React.FC<Props> = ({
  openDialogWithSelectedReport,
  codeInsightsReport,
  isActive,
  isModalView,
}) => {
  return (
    <CardItemWrapper
      onClick={openDialogWithSelectedReport}
      isModalView={isModalView}
      isActive={isActive}
      tabIndex={0}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          openDialogWithSelectedReport();
        }
      }}
    >
      {!isModalView && <Icon report={codeInsightsReport} />}
      <CardItemTitle>{codeInsightsReport.title}</CardItemTitle>
      {isModalView && <Icon report={codeInsightsReport} />}
    </CardItemWrapper>
  );
};

export default CodeInsightsCardItem;
