import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import SectionMessage from '@atlaskit/section-message';
import { CopyableTextFieldStateless } from '@atlassian/bitkit-copy';
import { getCloneUrl, CloneProtocol } from '@atlassian/bitkit-clone-controls';
import { Repository } from 'src/components/types';

import MirrorCloneUrl from '../components/mirror-clone-url';
import urls from '../urls';
import { Mirror } from '../types';

import messages from './mirror-clone-controls.i18n';
import * as styles from './mirror-clone-controls.style';

type Props = {
  intl: InjectedIntl;
  mirrors?: Mirror[];
  protocol: CloneProtocol;
  repository: Repository;
};

export default injectIntl(
  class MirrorCloneControls extends PureComponent<Props> {
    render() {
      if (!this.props.mirrors || this.props.mirrors.length === 0) {
        return null;
      }

      const { intl, mirrors, protocol, repository } = this.props;
      const pushUrl = getCloneUrl(protocol, repository);
      const setPushUrlCommand = pushUrl
        ? `git remote set-url --push origin ${pushUrl}`
        : '';

      return (
        <styles.Wrapper>
          <styles.MirrorHeading>
            <FormattedMessage tagName="h3" {...messages.heading} />
          </styles.MirrorHeading>
          <SectionMessage
            appearance="info"
            title={intl.formatMessage(messages.infoLabel)}
          >
            <FormattedMessage
              {...messages.infoDescription}
              tagName="p"
              values={{
                link: (
                  <a href={urls.external.updateMirrorPushUrl} target="_blank">
                    <FormattedMessage {...messages.infoDescriptionLinkText} />
                  </a>
                ),
              }}
            />
            <CopyableTextFieldStateless isReadOnly value={setPushUrlCommand} />
          </SectionMessage>
          {mirrors.map(mirror => (
            <MirrorCloneUrl
              key={mirror.id}
              mirror={mirror}
              protocol={protocol}
              repository={repository}
            />
          ))}
        </styles.Wrapper>
      );
    }
  }
);
