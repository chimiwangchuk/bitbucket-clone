import React from 'react';
import { colors } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import PremiumIcon from '@atlaskit/icon/glyph/premium';
import { useIntl } from 'src/hooks/intl';
import { publishUiEvent } from 'src/utils/analytics/publish';
import urls from 'src/urls';
import messages from './code-insights.i18n';
import {
  ReportLockedWrapper,
  UpgradeCardWrapper,
  UpgradeCardIcon,
  UpgradeCardButtons,
  UpgradeCardContent,
} from './code-insights.style';
import lockIconUrl from './code-insights-lock-icon.svg';

const CodeInsightsReportLocked: React.FC = () => {
  const intl = useIntl();

  return (
    <ReportLockedWrapper>
      <img
        alt={intl.formatMessage(messages.lockedReportIcon)}
        src={lockIconUrl}
      />
      <h3>{intl.formatMessage(messages.lockedReportHeading)}</h3>
      <UpgradeCardWrapper>
        <UpgradeCardIcon>
          <PremiumIcon
            label={intl.formatMessage(messages.premiumResultIcon)}
            primaryColor={colors.B400}
            size="medium"
          />
        </UpgradeCardIcon>
        <UpgradeCardContent>
          <h3>{intl.formatMessage(messages.lockedReportUpgradeHeading)}</h3>
          <p>{intl.formatMessage(messages.lockedReportUpgradeMessage)}</p>
        </UpgradeCardContent>
        <UpgradeCardButtons>
          <Button
            appearance="subtle"
            href={urls.external.codeInsightsLearnMore}
            target="_blank"
            rel="nofollow"
            onClick={() =>
              publishUiEvent({
                action: 'clicked',
                actionSubject: 'button',
                source: 'codeInsightsModal',
                actionSubjectId: 'upgradeLearnMoreButton',
              })
            }
          >
            {intl.formatMessage(messages.learnMore)}
          </Button>
          <Button
            appearance="primary"
            href={urls.ui.adminPlans}
            onClick={() =>
              publishUiEvent({
                action: 'clicked',
                actionSubject: 'button',
                source: 'codeInsightsModal',
                actionSubjectId: 'seePlansButton',
              })
            }
          >
            {intl.formatMessage(messages.seePlans)}
          </Button>
        </UpgradeCardButtons>
      </UpgradeCardWrapper>
    </ReportLockedWrapper>
  );
};

export default CodeInsightsReportLocked;
