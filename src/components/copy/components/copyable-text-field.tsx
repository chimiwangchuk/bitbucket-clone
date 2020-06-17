import React, { PureComponent, ComponentProps } from 'react';

import CopyableTextFieldStateless from './copyable-text-field-stateless';

type CopyableTextFieldProps = ComponentProps<
  typeof CopyableTextFieldStateless
> & {
  initialValue?: string;
  onCopy: (text: string) => void;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
};

type CopyableTextFieldState = {
  value?: string;
};

export default class CopyableTextField extends PureComponent<
  CopyableTextFieldProps,
  CopyableTextFieldState
> {
  textField: HTMLInputElement | undefined;

  static defaultProps = {
    onChange: () => {},
    onCopy: () => {},
  };

  state = {
    value: this.props.initialValue,
  };

  focus() {
    if (this.textField) {
      this.textField.focus();
    }
  }

  select() {
    if (this.textField) {
      this.textField.select();
    }
  }

  handleTextFieldRef = (textField: HTMLInputElement) => {
    this.textField = textField;
  };

  handleOnChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({ value: e.target.value });
    }

    this.props.onChange(e);
  };

  render() {
    const { onCopy, ...otherProps } = this.props;

    return (
      <CopyableTextFieldStateless
        {...otherProps}
        onChange={this.handleOnChange}
        onCopy={onCopy}
        forwardedRef={this.handleTextFieldRef}
        value={this.state.value}
      />
    );
  }
}
