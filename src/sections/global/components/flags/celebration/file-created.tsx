import React, { Fragment, PureComponent } from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntl,
} from 'react-intl';
import { TOGGLE_CLONE_DIALOG } from 'src/sections/repository/actions';
import { ComponentFlagId } from 'src/redux/flags/types';
import * as styles from './flag.style';

import CelebrationFlag from './flag';

const messages = defineMessages({
  title: {
    id: 'frontbucket.flags.celebration.fileCreated.title',
    description:
      'Heading text telling the user their next step is to clone the repository',
    defaultMessage: 'Next step: Clone repository',
  },
  description: {
    id: 'frontbucket.flags.celebration.fileCreated.description',
    description:
      'Text informing the user that they should try cloning the repository next',
    defaultMessage:
      'Oh hey, a shiny new file! Let’s get this thriving repository onto your local computer. To do that, you’ll want to clone from the command line or Sourcetree. ',
  },
  cloneButton: {
    id: 'frontbucket.flags.celebration.fileCreated.clone',
    description: 'A button that will open the "Clone repository" dialog',
    defaultMessage: 'Clone repository',
  },
  learnMoreLink: {
    id: 'frontbucket.repository.cloneGuidance.learnMoreLink',
    description: 'A link to more information about cloning a repository',
    defaultMessage: 'Learn more',
  },
});

type fileCreatedFlagProps = {
  id: ComponentFlagId;
  intl: InjectedIntl;
};

export default injectIntl(
  class FileCreatedFlag extends PureComponent<fileCreatedFlagProps> {
    render() {
      const { intl, ...props } = this.props;

      const fullMessage = (
        <Fragment>
          <FormattedMessage {...messages.description} />
          <styles.Link
            href="https://confluence.atlassian.com/bitbucket/clone-a-repository-223217891.html"
            target="_blank"
          >
            <FormattedMessage {...messages.learnMoreLink} />
          </styles.Link>
        </Fragment>
      );
      return (
        <CelebrationFlag
          title={intl.formatMessage(messages.title)}
          description={fullMessage}
          actions={[
            {
              content: intl.formatMessage(messages.cloneButton),
              analyticsId: 'clone',
              reduxActionType: TOGGLE_CLONE_DIALOG,
              reduxActionPayload: true,
              type: 'dispatch',
            },
          ]}
          {...props}
        />
      );
    }
  }
);
