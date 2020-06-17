import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'src/hooks/intl';
import { usePref } from 'src/hooks/use-pref';
import { StepModal } from './step-modal';
import { HeaderWrapper, AbsWrapper } from './styles';
import messages from './shared.i18n';
import headerBgSvg from './assets/header-bg.svg';
import bbWorkSvg from './assets/bb-work.svg';
import settingsProfileSvg from './assets/settings-profile.svg';
import urls from './urls';

const Header = ({ children }: React.PropsWithChildren<any>) => (
  <HeaderWrapper>
    <img alt="" width="100%" src={headerBgSvg} role="presentation" />
    <AbsWrapper width={190} height={121} bottom={-20}>
      {children}
    </AbsWrapper>
  </HeaderWrapper>
);

export const WorkspacesOnboarding = memo(() => {
  const intl = useIntl();
  const [seen, updatePref, isLoading] = usePref('workspaces-onboarding-seen');
  if (isLoading || seen) {
    return null;
  }
  return (
    <StepModal
      steps={[
        {
          heading: intl.formatMessage(messages.workspacesStep1Heading),
          children: intl.formatMessage(messages.workspacesStep1Text),
          header: () => (
            <Header>
              <img alt="" src={bbWorkSvg} role="presentation" />
            </Header>
          ),
        },
        {
          heading: intl.formatMessage(messages.workspacesStep2Heading),
          children: (
            <FormattedMessage
              {...messages.workspacesStep2Text}
              values={{
                personalSettings: (
                  <strong>
                    <FormattedMessage {...messages.personalSettings} />
                  </strong>
                ),
              }}
            />
          ),
          header: () => (
            <Header>
              <img alt="" src={settingsProfileSvg} role="presentation" />
            </Header>
          ),
          action: () => ({
            href: urls.external.learnMore,
            target: '_blank',
            children: intl.formatMessage(messages.learnMoreButtonText),
          }),
        },
      ]}
      onDismiss={() => updatePref('true')}
    />
  );
});

export default WorkspacesOnboarding;
