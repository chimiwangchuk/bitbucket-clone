import React, { Component, ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Tooltip from '@atlaskit/tooltip';
import {
  FolderOpenIcon,
  FolderClosedIcon,
  IconSizes,
} from '@atlassian/bitkit-icon';

import messages from './i18n';
import * as styles from './styled';

export type DirectoryProps = {
  children: ReactNode;
  defaultCollapsed: boolean;
  intl: InjectedIntl;
  name: string;
};

export type DirectoryState = {
  isCollapsed: boolean;
};

// @ts-ignore TODO: fix noImplicitAny error here
const toggleCollapseStateUpdater = (prevState): DirectoryState => ({
  isCollapsed: !prevState.isCollapsed,
});

class Directory extends Component<DirectoryProps, DirectoryState> {
  static defaultProps = {
    defaultCollapsed: true,
  };

  constructor(props: DirectoryProps) {
    super(props);

    const { defaultCollapsed } = this.props;

    this.state = {
      isCollapsed: defaultCollapsed,
    };
  }

  toggleDirectory = (): void => {
    this.setState(toggleCollapseStateUpdater);
  };

  renderFolderIcon() {
    const { intl } = this.props;
    const { isCollapsed } = this.state;

    return (
      <styles.DirectoryFolder>
        {isCollapsed ? (
          <FolderClosedIcon
            label={intl.formatMessage(messages.directory)}
            size={IconSizes.Small}
          />
        ) : (
          <FolderOpenIcon
            label={intl.formatMessage(messages.directory)}
            size={IconSizes.Small}
          />
        )}
      </styles.DirectoryFolder>
    );
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  handleHeaderKey = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.toggleDirectory();
    }
  };

  render() {
    const { children, name } = this.props;
    const { isCollapsed } = this.state;

    return (
      <styles.Directory>
        <styles.DirectoryHeader
          tabIndex={0}
          onClick={this.toggleDirectory}
          onMouseDown={e => e.preventDefault()}
          onKeyDown={this.handleHeaderKey}
        >
          {this.renderFolderIcon()}
          <styles.TooltipWrapper>
            <Tooltip position="left" content={name}>
              <styles.FileName>{name}</styles.FileName>
            </Tooltip>
          </styles.TooltipWrapper>
        </styles.DirectoryHeader>
        {!isCollapsed && (
          <styles.DirectoryContent>{children}</styles.DirectoryContent>
        )}
      </styles.Directory>
    );
  }
}

export default injectIntl(Directory);
