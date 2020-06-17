import React, { Fragment, PureComponent } from 'react';

import { KeyboardShortcuts } from 'src/redux/keyboard-shortcuts';
import * as styles from './keyboard-shortcut-menu.style';

type Props = {
  shortcuts: KeyboardShortcuts;
};

export default class KeyboardShortcutMenu extends PureComponent<Props> {
  static defaultProps = {
    shortcuts: {},
  };

  render() {
    const { shortcuts } = this.props;
    const sortedGroupIds = Object.keys(shortcuts).sort(
      (idA: string, idB: string) =>
        (shortcuts[idA].groupWeight || 0) - (shortcuts[idB].groupWeight || 0)
    );
    return (
      <Fragment>
        {sortedGroupIds.map(
          id =>
            !!shortcuts[id].groupTitle && (
              <styles.ShortcutGroup key={id}>
                <styles.GroupTitle>
                  {shortcuts[id].groupTitle}
                </styles.GroupTitle>
                <styles.Shortcuts>
                  {shortcuts[id].shortcuts.map(
                    shortcut =>
                      !!shortcut.description && (
                        <styles.Shortcut key={shortcut.id}>
                          <dt>{shortcut.description}</dt>
                          <styles.ShortcutKeys>
                            <styles.ShortcutKey>
                              {shortcut.keys}
                            </styles.ShortcutKey>
                          </styles.ShortcutKeys>
                        </styles.Shortcut>
                      )
                  )}
                </styles.Shortcuts>
              </styles.ShortcutGroup>
            )
        )}
      </Fragment>
    );
  }
}
