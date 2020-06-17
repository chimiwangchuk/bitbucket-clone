import React, { PureComponent } from 'react';
import { defineMessages, injectIntl, InjectedIntl } from 'react-intl';
import urls from 'src/sections/repository/urls';
import { ComponentFlagId } from 'src/redux/flags/types';
import { commonMessages } from 'src/i18n';
import CelebrationFlag from './flag';

const messages = defineMessages({
  title: {
    id: 'frontbucket.flags.celebration.accountCreated.title',
    description:
      'Heading text telling the user their next step is to create a repository',
    defaultMessage: 'Next step: Create repository',
  },
  description: {
    id: 'frontbucket.flags.celebration.accountCreated.description',
    description:
      'Text informing the user that they should try creating a repository next',
    defaultMessage:
      'You made it into Bitbucket! Get cozy and take a look around. If you’re wondering what to do next, we suggest you create a repository for storing your files.',
  },
});

type AccountCreatedFlagProps = {
  id: ComponentFlagId;
  intl: InjectedIntl;
};

export default injectIntl(
  class AccountCreatedFlag extends PureComponent<AccountCreatedFlagProps> {
    render() {
      const { intl, ...props } = this.props;
      return (
        <CelebrationFlag
          title={intl.formatMessage(messages.title)}
          description={intl.formatMessage(messages.description)}
          actions={[
            {
              content: intl.formatMessage(
                commonMessages.createRepositoryButton
              ),
              analyticsId: 'create-repository',
              href: urls.ui.create(),
              type: 'link',
            },
          ]}
          {...props}
        />
      );
    }
  }
);
