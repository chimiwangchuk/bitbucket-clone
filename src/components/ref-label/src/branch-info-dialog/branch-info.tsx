import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import * as styles from './branch-info.styled';
import messages from './branch-info.i18n';

type IntlProps = {
  intl: InjectedIntl;
};

type Props = IntlProps & {
  branchHref?: string;
  branchName: string;
  repoAvatarSrc?: string;
  repoHref?: string;
  repoName?: string;
  repoOwnerAvatarSrc?: string;
  repoOwnerHref?: string;
  repoOwnerName?: string;
  isWorkspaceUiEnabled?: boolean;
};

class BranchInfo extends PureComponent<Props> {
  renderRepositoryOwner() {
    const {
      intl,
      repoOwnerAvatarSrc,
      repoOwnerHref,
      repoOwnerName,
      isWorkspaceUiEnabled,
    } = this.props;

    if (!repoOwnerName) {
      return null;
    }

    const repoOwnerAvatar = (
      <Avatar name={repoOwnerName} size="small" src={repoOwnerAvatarSrc} />
    );

    return (
      <tr>
        <styles.TableLeftColumn>
          {isWorkspaceUiEnabled
            ? intl.formatMessage(messages.repoWorkspaceLabel)
            : intl.formatMessage(messages.repoOwnerLabel)}
        </styles.TableLeftColumn>
        <styles.TableRightColumn>
          {repoOwnerHref ? (
            <Button
              appearance="link"
              href={repoOwnerHref}
              iconBefore={repoOwnerAvatar}
              target="_blank"
            >
              {repoOwnerName}
            </Button>
          ) : (
            <styles.FormerUser>
              <styles.FormerUserAvatar>
                {repoOwnerAvatar}
              </styles.FormerUserAvatar>
              <styles.FormerUserName>{repoOwnerName}</styles.FormerUserName>
            </styles.FormerUser>
          )}
        </styles.TableRightColumn>
      </tr>
    );
  }

  render() {
    const {
      branchHref,
      branchName,
      intl,
      repoAvatarSrc,
      repoHref,
      repoName,
    } = this.props;

    return (
      <styles.BranchInfo>
        <styles.TableBody>
          {this.renderRepositoryOwner()}
          <tr>
            <styles.TableLeftColumn>
              {intl.formatMessage(messages.repoNameLabel)}
            </styles.TableLeftColumn>
            <styles.TableRightColumn>
              <Button
                appearance="link"
                isDisabled={!repoName}
                href={repoHref}
                iconBefore={
                  <Avatar name={repoName} src={repoAvatarSrc} size="small" />
                }
                target="_blank"
              >
                {repoName || intl.formatMessage(messages.deletedRepository)}
              </Button>
            </styles.TableRightColumn>
          </tr>
          <tr>
            <styles.TableLeftColumn>
              {intl.formatMessage(messages.branchLabel)}
            </styles.TableLeftColumn>
            <styles.TableRightColumn>
              <Button
                appearance="link"
                href={branchHref}
                isDisabled={!branchHref}
                target="_blank"
              >
                {branchName}
              </Button>
            </styles.TableRightColumn>
          </tr>
        </styles.TableBody>
      </styles.BranchInfo>
    );
  }
}

export default injectIntl(BranchInfo);
