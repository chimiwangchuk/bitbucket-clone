import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { SpotlightCard } from '@atlaskit/onboarding';
import Button, { ButtonGroup } from '@atlaskit/button';
import { useIntl } from 'src/hooks/intl';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { ComponentFlagProps } from 'src/redux/flags/types';
import { publishUiEvent } from 'src/utils/analytics/publish';
import store from 'src/utils/store';

import * as styles from '../celebration/flag.style';
import { DescriptionWrapper } from './mega-launch-flag.style';
import messages from './mega-launch.i18n';

type MegaLaunchFlagProps = ComponentFlagProps & {
  onDismissed: (id: string) => void;
};

export const megaLaunchDismissedLocalstorageKey = (currentUserUuid: string) =>
  `mega_launch_flag_dismissed::${currentUserUuid}`;

const MegaLaunchFlag = ({ onDismissed, id }: MegaLaunchFlagProps) => {
  const intl = useIntl();
  const currentUser = useSelector(getCurrentUser, shallowEqual);
  const currentUserUuid = currentUser ? currentUser.uuid : '';
  const publishAnalyticsEvent = (buttonType: 'blog' | 'dismiss') =>
    publishUiEvent({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'megaLaunchFlag',
      source: 'megaLaunchFlagJune2020',
      attributes: {
        buttonType,
      },
    });

  const onDismissedFlag = () => {
    const MEGA_LAUNCH_FLAG_DISMISSED_LOCALSTORAGE_KEY = megaLaunchDismissedLocalstorageKey(
      currentUserUuid
    );

    onDismissed(id);
    store.set(MEGA_LAUNCH_FLAG_DISMISSED_LOCALSTORAGE_KEY, true);
    publishAnalyticsEvent('dismiss');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <SpotlightCard heading={intl.formatMessage(messages.title)}>
      <DescriptionWrapper>
        <FormattedMessage {...messages.description} />
      </DescriptionWrapper>
      <styles.Actions>
        <styles.ActionItems>
          <ButtonGroup>
            <Button
              onClick={() => publishAnalyticsEvent('blog')}
              href="https://www.atlassian.com/blog/devops/new-collaboration-features"
              target="_blank"
            >
              <FormattedMessage {...messages.learnMore} />
            </Button>
            <Button onClick={() => onDismissedFlag()}>
              <FormattedMessage {...messages.dismiss} />
            </Button>
          </ButtonGroup>
        </styles.ActionItems>
      </styles.Actions>
    </SpotlightCard>
  );
};

export default MegaLaunchFlag;
