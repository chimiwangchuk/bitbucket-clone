import React, { PureComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Textfield, { TextFieldProps } from '@atlaskit/textfield';

import * as styles from '../styles';
import CopyButton from './copy-button';

type CopyableTextFieldProps = TextFieldProps & {
  initialValue?: string;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  onCopy: (text: string) => void;
  forwardedRef?: (ref?: HTMLInputElement) => void;
};

export default class CopyableTextField extends PureComponent<
  CopyableTextFieldProps
> {
  textField: HTMLInputElement | undefined;

  static defaultProps = {
    onChange: () => {},
    onCopy: () => {},
    value: '',
  };

  focus() {
    if (this.textField) {
      this.textField.focus();
    }
  }

  select() {
    if (this.textField && this.textField) {
      this.textField.select();
    }
  }

  handleCopy = (text: string) => {
    this.select();
    this.focus();
    this.props.onCopy(text);
  };

  handleTextFieldRef = (textField: HTMLInputElement | undefined) => {
    this.textField = textField;
    if (this.props.forwardedRef) {
      this.props.forwardedRef(textField);
    }
  };

  render() {
    // Destructuring onCopy and initialValue so that they don't get passed in
    // to FieldTextStateless that doesn't have those attributes typed.
    const {
      value,
      onCopy,
      initialValue,
      forwardedRef,
      ...otherProps
    } = this.props;

    const computedValue = () => {
      if (typeof value === 'number') {
        return value.toString();
      }
      return value as string;
    };

    return (
      <styles.Container>
        <styles.TextField>
          <Textfield
            {...otherProps}
            ref={this.handleTextFieldRef}
            value={value}
          />
        </styles.TextField>
        {/* CopyButton only takes in a String type for `value` vs
        FieldTextStateless handles both String and Number */}
        <CopyButton onCopy={this.handleCopy} value={computedValue()} />
      </styles.Container>
    );
  }
}
