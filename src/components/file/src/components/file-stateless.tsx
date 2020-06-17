import React, { PureComponent, ReactNode, MouseEvent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import AnimateHeight from 'react-animate-height';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import messages from '../i18n';
import * as styles from '../styles';
import FilePath from './file-path';

export type FileStatelessProps = {
  buttons?: JSX.Element;
  children: ReactNode;
  dropdownMenu?: JSX.Element;
  filePath?: string;
  prevFilePath?: string;
  icon?: JSX.Element;
  isCollapsible?: boolean;
  isExpanded?: boolean;
  toggleExpanded?: (isCurrentlyExpanded: boolean) => void;
  isDropdownMenuOpen?: boolean;
  renderAfterFilePath?: () => ReactNode;
  renderBeforeActions?: () => ReactNode;
  hasStickyHeader?: boolean;
  stickyHeaderOffset?: number;
  renderFilePath?: () => ReactNode;
};

type InjectedProps = {
  intl: InjectedIntl;
};

// use this to prevent the triggering of expand/collapse behavior
function stopPropagation(e: MouseEvent): void {
  e.stopPropagation();
}

class FileStateless extends PureComponent<FileStatelessProps & InjectedProps> {
  static defaultProps = {
    isExpanded: false,
    hasStickyHeader: false,
    isDropdownMenuOpen: false,
  };

  handleToggle = () => {
    const { isExpanded, toggleExpanded, isCollapsible } = this.props;
    if (isCollapsible && toggleExpanded) {
      toggleExpanded(!!isExpanded);
    }
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      this.handleToggle();
    }
  };

  renderHeader() {
    const {
      filePath,
      prevFilePath,
      icon,
      intl,
      isCollapsible,
      isExpanded,
      renderAfterFilePath,
      renderBeforeActions,
      isDropdownMenuOpen,
      hasStickyHeader,
      stickyHeaderOffset,
      renderFilePath,
    } = this.props;

    return (
      <styles.FileHeader
        isDropdownMenuOpen={isDropdownMenuOpen}
        isExpanded={!isCollapsible ? true : isExpanded}
        isCollapsible={isCollapsible}
        hasStickyHeader={hasStickyHeader}
        stickyHeaderOffset={stickyHeaderOffset}
        onClick={this.handleToggle}
        data-qa="bk-file__header"
        tabIndex={isCollapsible ? 0 : undefined}
        onKeyPress={isCollapsible ? this.handleKeyPress : undefined}
      >
        {isCollapsible && (
          <styles.ChevronWrapper isExpanded={isExpanded}>
            <ChevronDownIcon
              label={intl.formatMessage(messages.fileChevronIcon)}
            />
          </styles.ChevronWrapper>
        )}
        {icon && <styles.IconWrapper>{icon}</styles.IconWrapper>}
        <styles.FilePathWrapper>
          {renderFilePath ? (
            renderFilePath()
          ) : (
            <FilePath prevFilePath={prevFilePath}>{filePath}</FilePath>
          )}
          {renderAfterFilePath && (
            <styles.AfterFilePath>{renderAfterFilePath()}</styles.AfterFilePath>
          )}
        </styles.FilePathWrapper>

        <styles.Actions>
          {renderBeforeActions && (
            <styles.BeforeActions>{renderBeforeActions()}</styles.BeforeActions>
          )}

          {this.renderFileActions()}
        </styles.Actions>
      </styles.FileHeader>
    );
  }

  renderFileActions() {
    const { buttons } = this.props;

    return (
      <styles.FileActions data-qa="bk-file__actions">
        {buttons && (
          <styles.FileButtons
            onClick={stopPropagation}
            data-qa="bk-file__action-button"
          >
            {buttons}
          </styles.FileButtons>
        )}
        {this.renderDropdownMenu()}
      </styles.FileActions>
    );
  }

  renderDropdownMenu() {
    const { dropdownMenu } = this.props;

    if (dropdownMenu) {
      return (
        <styles.FileMenu onClick={stopPropagation} data-qa="bk-file__menu">
          {dropdownMenu}
        </styles.FileMenu>
      );
    }

    return null;
  }

  renderFile() {
    const { children } = this.props;

    return (
      <div>
        {this.renderHeader()}
        <styles.FileContent data-qa="bk-file__content">
          {children}
        </styles.FileContent>
      </div>
    );
  }

  renderCollapsibleFile() {
    const { isExpanded, children } = this.props;

    return (
      <div>
        {this.renderHeader()}
        <AnimateHeight
          duration={200}
          easing="linear"
          height={isExpanded ? 'auto' : 0}
        >
          <styles.FileContent data-qa="bk-file__content">
            {children}
          </styles.FileContent>
        </AnimateHeight>
      </div>
    );
  }

  render() {
    const { isCollapsible } = this.props;

    return isCollapsible ? this.renderCollapsibleFile() : this.renderFile();
  }
}

export default injectIntl(FileStateless);
