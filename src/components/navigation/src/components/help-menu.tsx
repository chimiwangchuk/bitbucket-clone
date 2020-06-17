import React, { PureComponent, Fragment } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import Fact, { FactContext } from '@atlassian/bitkit-analytics';

import urls from '../urls';
import { DropdownItem, DropdownItemGroup } from './dropdown-helpers';
import messages from './help-menu.i18n';
import OverlayDropdown from './overlay-dropdown';
import * as styles from './overlay-dropdown.style';
import WhatsNewPostItem from './whats-new-post-item';
import WhatsNewParentItem from './whats-new-parent-item';
import { WhatsNewSubmenuOpenedFact, WhatsNewPostClickedFact } from './facts';
import { Blog } from './blog-fetch';

export type ExternalHelpMenuProps = {
  isWhatsNewEnabled: boolean;
  onKeyboardShortcutsActivated: () => void;
};

export type HelpMenuProps = ExternalHelpMenuProps & {
  blogs: Blog[];
  newBlogCount: number;
  storeLastSeenBlog: () => void;
  isAkDropdown: boolean;
  intl: InjectedIntl;
};

class HelpMenu extends PureComponent<HelpMenuProps> {
  renderDropdownItems = (
    publishFact: (f: Fact<any>) => void,
    blogs: Blog[],
    newBlogCount: number,
    storeLastSeenBlog: () => void
  ) => {
    const { intl, isWhatsNewEnabled, isAkDropdown } = this.props;
    return (
      <OverlayDropdown
        overlayContent={hideOverlay => (
          <Fragment>
            <styles.OverlayHeader onClick={hideOverlay} tabIndex={0}>
              <ChevronLeftIcon size="small" label="" />{' '}
              {intl.formatMessage(messages.whatsNewTitle)}
            </styles.OverlayHeader>
            <styles.PostsWrapper isAkDropdown={isAkDropdown}>
              {blogs.map(whatsNewItem => (
                <WhatsNewPostItem
                  key={whatsNewItem.id}
                  onClick={() => {
                    publishFact(new WhatsNewPostClickedFact());
                  }}
                  {...whatsNewItem}
                />
              ))}
            </styles.PostsWrapper>
          </Fragment>
        )}
        onOverlayHidden={storeLastSeenBlog}
      >
        {showOverlay => (
          <Fragment>
            <DropdownItemGroup
              isAkDropdown={isAkDropdown}
              title={intl.formatMessage(messages.helpHeading)}
            >
              {isWhatsNewEnabled && blogs.length ? (
                <WhatsNewParentItem
                  isAkDropdown={isAkDropdown}
                  newBlogCount={newBlogCount}
                  onClick={(e: React.MouseEvent<any>) => {
                    showOverlay(e);
                    publishFact(new WhatsNewSubmenuOpenedFact());
                  }}
                />
              ) : null}
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.documentation()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.documentationLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.gettingGitRight()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.learnGitLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                onClick={this.props.onKeyboardShortcutsActivated}
              >
                {intl.formatMessage(messages.keyboardShortcutsButton)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.tutorials()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.tutorialsLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.apiDocumentation()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.apiLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.ui.support()}
              >
                {intl.formatMessage(messages.supportLink)}
              </DropdownItem>
            </DropdownItemGroup>
            <DropdownItemGroup
              isAkDropdown={isAkDropdown}
              title={intl.formatMessage(messages.informationHeading)}
            >
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.blog()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.blogLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.ui.plans()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.plansLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.status()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.siteStatusLink)}
              </DropdownItem>
            </DropdownItemGroup>
            <DropdownItemGroup
              isAkDropdown={isAkDropdown}
              title={intl.formatMessage(messages.legalHeading)}
            >
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.termsOfService()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.termsOfServiceLink)}
              </DropdownItem>
              <DropdownItem
                isAkDropdown={isAkDropdown}
                href={urls.external.privacyPolicy()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.privacyPolicyLink)}
              </DropdownItem>
            </DropdownItemGroup>
          </Fragment>
        )}
      </OverlayDropdown>
    );
  };

  render() {
    const { blogs, newBlogCount, storeLastSeenBlog } = this.props;

    return (
      <FactContext.Consumer>
        {({ publishFact }) =>
          this.renderDropdownItems(
            publishFact,
            blogs,
            newBlogCount,
            storeLastSeenBlog
          )
        }
      </FactContext.Consumer>
    );
  }
}

export default injectIntl(HelpMenu);
