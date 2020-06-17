import React, { PureComponent } from 'react';
import { defineMessages, injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import urls from 'src/sections/repository/urls';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';

import { ComponentFlagId } from 'src/redux/flags/types';
import { BucketState } from 'src/types/state';
import CelebrationFlag from './flag';

const mapStateToProps = (state: BucketState) => ({
  repositoryOwner: getCurrentRepositoryOwnerName(state),
  repositorySlug: getCurrentRepositorySlug(state),
});

const messages = defineMessages({
  title: {
    id: 'frontbucket.flags.celebration.repoCreated.title',
    description:
      'Heading text telling the user their next step is to create a README file',
    defaultMessage: 'Next step: Add a README',
  },
  description: {
    id: 'frontbucket.flags.celebration.repoCreated.description',
    description:
      'Text informing the user that they should try creating a README file next',
    defaultMessage:
      'That’s a nice, empty repository you’ve got there! Wanna give it some purpose? Start with a README, where you’ll keep your repository setup details.',
  },
  createReadmeButton: {
    id: 'frontbucket.flags.celebration.repoCreated.createReadmeButton',
    description:
      'A button linking to a page where the user can create a README file',
    defaultMessage: 'Add README',
  },
});

type RepoCreatedFlagProps = {
  id: ComponentFlagId;
  intl: InjectedIntl;
  repositoryOwner?: string;
  repositorySlug?: string;
  isDismissAllowed?: boolean;
};

export default connect(mapStateToProps)(
  injectIntl(
    class RepositoryCreatedFlag extends PureComponent<RepoCreatedFlagProps> {
      static defaultProps = {
        isDismissAllowed: false,
      };

      render() {
        const { intl, repositoryOwner, repositorySlug, ...props } = this.props;

        if (!repositoryOwner || !repositorySlug) {
          return null;
        }

        return (
          <CelebrationFlag
            title={intl.formatMessage(messages.title)}
            description={intl.formatMessage(messages.description)}
            actions={[
              {
                content: intl.formatMessage(messages.createReadmeButton),
                analyticsId: 'create-readme',
                href: `${urls.ui.repository(
                  repositoryOwner,
                  repositorySlug
                )}/create-file/?filename=README.md&template=1`,

                type: 'link',
              },
            ]}
            {...props}
          />
        );
      }
    }
  )
);
