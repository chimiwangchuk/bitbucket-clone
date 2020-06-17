import React, { Component, Fragment, ReactNode } from 'react';

import ListKeyboardShortcuts, {
  ListKeyboardShortcutMessages,
} from './list-keyboard-shortcuts';

type State = {
  focusedRowIndex: number | null | undefined;
  isFocusing: boolean;
};

export type RenderProps = {
  focusedRowIndex: number | null | undefined;
};

type Props<T> = {
  isLoading: boolean;
  rows: T[];
  [propName: string]: any;
};

type WrapperProps<T> = Props<T> & {
  messages: ListKeyboardShortcutMessages;
  children: (props: RenderProps) => ReactNode;
};

export class WithListKeyboardShortcuts<T> extends Component<
  WrapperProps<T>,
  State
> {
  state: State = {
    focusedRowIndex: null,
    isFocusing: false,
  };

  handleFocusedRowChange = (delta: -1 | 1) => () => {
    this.setState(
      (state, props) => {
        if (state.isFocusing) {
          return null;
        }
        const { focusedRowIndex: index } = state;
        const lastRowIndex = props.rows.length - 1;
        const isFocusing = true;
        if (index == null) {
          return {
            isFocusing,
            focusedRowIndex: delta === 1 ? 0 : lastRowIndex,
          };
        }
        if (index + delta < 0) {
          return {
            isFocusing,
            focusedRowIndex: lastRowIndex,
          };
        }
        if (index + delta > lastRowIndex) {
          return {
            isFocusing,
            focusedRowIndex: 0,
          };
        }
        return {
          isFocusing,
          focusedRowIndex: index + delta,
        };
      },
      () => {
        this.setState({ isFocusing: false });
      }
    );
  };

  handleFocusNextRow = this.handleFocusedRowChange(1);
  handleFocusPreviousRow = this.handleFocusedRowChange(-1);

  handleOpenFocusedRow = () => {
    const { focusedRowIndex } = this.state;
    if (focusedRowIndex != null) {
      const selected = this.props.rows[focusedRowIndex];
      if (selected) {
        window.location.assign((selected as any).links.html.href);
      }
    }
  };

  handleUnfocusRow = () => {
    if (this.state.focusedRowIndex != null) {
      this.setState({ focusedRowIndex: null });
    }
  };

  render() {
    const { isLoading, rows, messages } = this.props;
    const { focusedRowIndex } = this.state;
    return (
      <Fragment>
        <ListKeyboardShortcuts
          isDisabled={!rows.length || isLoading}
          onFocusNextRow={this.handleFocusNextRow}
          onFocusPreviousRow={this.handleFocusPreviousRow}
          onOpenSelectedRow={this.handleOpenFocusedRow}
          onUnfocusRow={this.handleUnfocusRow}
          messages={messages}
        />
        {this.props.children({ focusedRowIndex })}
      </Fragment>
    );
  }
}
