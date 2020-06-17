import React, { Component } from 'react';
import { throttle } from 'lodash-es';

import { stopPropagation } from '../utils/events';
import * as styles from './styles';
import { ExtendedMouseEvent } from './types';

export type SplitBarProps = {
  onClick: () => void;
  onResize: (offset: number) => void;
  onResizeComplete: () => void;
};

export type SplitBarState = {
  offset: number | null;
};

export default class SplitBar extends Component<SplitBarProps, SplitBarState> {
  debouncedMouseMove: (e: ExtendedMouseEvent) => void;

  static defaultProps = {
    onClick: () => {},
  };

  constructor(props: SplitBarProps) {
    super(props);

    this.state = {
      offset: null,
    };

    // Debounce mousemove handler in order to call it
    // no more than 60 times per second.
    const delay = 1000 / 60;

    // Bind methods to save the context
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.debouncedMouseMove = throttle(this.onMouseMove, delay, {
      leading: true,
      trailing: true,
    });
  }

  onMouseMove(e: ExtendedMouseEvent): void {
    const isLeftButton = (e.buttons || e.which) === 1;

    if (isLeftButton) {
      const offset = this.computeOffset(e);

      this.props.onResize(offset);
    }
  }

  computeOffset(e: ExtendedMouseEvent): number {
    const { offset } = this.state;
    const { pageX } = e;

    this.setState({
      offset: pageX,
    });

    return offset ? offset - pageX : 0;
  }

  onMouseDown(): void {
    window.document.addEventListener('mouseup', this.onMouseUp);
    window.document.addEventListener('mousemove', this.debouncedMouseMove);
  }

  onMouseUp(): void {
    const { onClick, onResizeComplete } = this.props;
    const { offset } = this.state;

    this.setState({
      offset: null,
    });

    window.document.removeEventListener('mouseup', this.onMouseUp);
    window.document.removeEventListener('mousemove', this.debouncedMouseMove);

    // If there was no mouse movement, treat it like a click
    if (!offset) {
      onClick();
      return;
    }

    if (typeof onResizeComplete === 'function') {
      onResizeComplete();
    }
  }

  render() {
    return (
      <styles.SplitBar
        onClick={stopPropagation}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}
