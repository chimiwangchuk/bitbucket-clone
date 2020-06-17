import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import Button from '@atlaskit/button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import Tooltip, { PositionType } from '@atlaskit/tooltip';

import messages from '../i18n';
import * as styles from '../styles';
import copy from '../utils/clipboard-copy';

type CopyButtonProps = {
  onCopy?: (copiedText: string) => void;
  intl: InjectedIntl;
  value?: string;
  buttonText?: string;
  shouldMatchTextFieldHeight?: boolean;
  tooltipPosition?: PositionType;
};

type CopyButtonState = {
  textIsCopied: boolean;
};

class CopyButton extends PureComponent<CopyButtonProps, CopyButtonState> {
  state = {
    textIsCopied: false,
  };

  handleClick = () => {
    const copiedText = this.props.value || '';
    copy(copiedText);

    if (this.props.onCopy) {
      this.props.onCopy(copiedText);
    }

    this.setState({ textIsCopied: true });
  };

  render() {
    const {
      shouldMatchTextFieldHeight = true,
      tooltipPosition = 'right',
      intl,
    } = this.props;

    const mainButton = (
      <Tooltip
        content={
          this.state.textIsCopied
            ? intl.formatMessage(messages.buttonClickedTooltip)
            : intl.formatMessage(messages.buttonTooltip)
        }
        position={tooltipPosition}
        onShow={() => this.setState({ textIsCopied: false })}
      >
        <Button
          onClick={this.handleClick}
          iconBefore={
            <CopyIcon
              label={this.props.intl.formatMessage(messages.buttonLabel)}
            />
          }
        >
          {this.props.buttonText || null}
        </Button>
      </Tooltip>
    );
    return shouldMatchTextFieldHeight ? (
      <styles.CopyButtonToMatchTextfield>
        {mainButton}
      </styles.CopyButtonToMatchTextfield>
    ) : (
      mainButton
    );
  }
}

export default injectIntl(CopyButton);
