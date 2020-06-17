import ReactShortcutHandler, {
  defineShortcut,
  // @ts-ignore TODO: fix noImplicitAny error here
} from '@atlassian/react-shortcut-handler';
import React, { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash-es';

import { KeyboardShortcutFired } from 'src/facts';
import { publishFact, publishUiEvent } from 'src/utils/analytics/publish';

import {
  registerShortcuts,
  unRegisterShortcuts,
  KeyboardShortcutGroup,
  KeyboardShortcutReference,
} from 'src/redux/keyboard-shortcuts';

export type KeyboardShortcut = KeyboardShortcutReference & {
  throttleWait?: number;
  handler: (event: KeyboardEvent, keys: string) => void;
};

export const generateKeyBindings = (
  shortcuts: KeyboardShortcut[],
  isDisabled: boolean
) =>
  shortcuts.reduce((bindings, shortcut) => {
    const { enableInFormFields, id, keys, throttleWait, handler } = shortcut;
    // @ts-ignore TODO: fix noImplicitAny error here
    const handlerWithAnalytics = (e, triggerKeys) => {
      if (!isDisabled) {
        publishFact(
          // @ts-ignore
          new KeyboardShortcutFired({
            shortcut_id: id,
            trigger_keys: triggerKeys,
          })
        );
        publishUiEvent({
          action: 'keyboardShortcutFired',
          actionSubject: 'keyboardShortcut',
          actionSubjectId: 'keyboardShortcut',
          source: 'unknown',
          attributes: {
            shortcut_id: id,
            trigger_keys: triggerKeys,
          },
        });
        handler(e, triggerKeys);
      }
    };
    return {
      ...bindings,
      [id]: defineShortcut(
        keys,
        throttleWait
          ? throttle(handlerWithAnalytics, throttleWait)
          : handlerWithAnalytics,
        !!enableInFormFields
      ),
    };
  }, {});

type KeyboardShortcutHandlerProps = {
  children?: ReactNode;
  // A unique id for identifying a set of shortcuts in redux
  groupId: string;
  // Title of the group of keyboard shortcuts in the help menu (group hidden if not present)
  groupTitle?: string;
  // Determines the order that the shortcuts groups are rendered in the help menu (higher numbers are rendered later)
  groupWeight?: number;
  isDisabled?: boolean;
  registerShortcuts: (group: KeyboardShortcutGroup) => void;
  // Controls whether or not the child component(s) need to be focused for the shortcuts to be enabled
  requiresFocus: boolean;
  shortcuts: KeyboardShortcut[];
  unRegisterShortcuts: (groupId: string) => void;
};

class KeyboardShortcutHandler extends PureComponent<
  KeyboardShortcutHandlerProps
> {
  static defaultProps = {
    requiresFocus: false,
    shortcuts: [],
    isDisabled: false,
  };

  componentDidMount() {
    this.registerShortcuts();
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  componentDidUpdate(prevProps) {
    if (
      prevProps.shortcuts !== this.props.shortcuts ||
      prevProps.groupId !== this.props.groupId
    ) {
      this.props.unRegisterShortcuts(prevProps.groupId);
      this.registerShortcuts();
    }
  }

  componentWillUnmount() {
    this.props.unRegisterShortcuts(this.props.groupId);
  }

  registerShortcuts() {
    const serializableShortcuts = this.props.shortcuts.map(shortcut => {
      const { handler: _handler, ...serializableProps } = shortcut;
      return serializableProps;
    });
    this.props.registerShortcuts({
      groupId: this.props.groupId,
      groupTitle: this.props.groupTitle,
      groupWeight: this.props.groupWeight,
      shortcuts: serializableShortcuts,
    });
  }

  render() {
    const { children, isDisabled, requiresFocus, shortcuts } = this.props;

    const keyBindings = generateKeyBindings(shortcuts, !!isDisabled);

    return (
      <ReactShortcutHandler isGlobal={!requiresFocus} keyBindings={keyBindings}>
        {children}
      </ReactShortcutHandler>
    );
  }
}

export default connect(null, {
  registerShortcuts,
  unRegisterShortcuts,
})(KeyboardShortcutHandler);
