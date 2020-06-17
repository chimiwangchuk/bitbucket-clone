import React, { CSSProperties, PureComponent } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { colors } from '@atlaskit/theme';
import ModalDialog, {
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import DialogChromeless from './chromeless/dialog';
import DialogIframe from './iframe';

type DialogProps = {
  connectHost: any;
  addonManager: any;
  options: any;
  extension: any;
  isOpen: boolean;
  dismissDialog: (e: any) => void;
  children?: (props: any) => JSX.Element;
};

export default class Dialog extends PureComponent<DialogProps, any> {
  getButtonAppearance = (key: string) => {
    if (key === 'submit') {
      return 'primary';
    } else if (key === 'cancel') {
      return 'subtle-link';
    }
    return 'default';
  };

  getIframeComponent(iframeProps: any) {
    const { connectHost, addonManager, children } = this.props;
    if (typeof children === 'function') {
      return children(iframeProps);
    }
    return (
      <DialogIframe
        {...iframeProps}
        connectHost={connectHost}
        addonManager={addonManager}
      />
    );
  }

  render() {
    const { isOpen, options, extension } = this.props;
    const {
      hint,
      width,
      height,
      chrome,
      closeOnEscape,
      actions = [],
    } = options;

    // This is now permanent unless a HEIGHT enum becomes available in Atlaskit in the future
    // ie. Products now decide what small/medium/large means for a dialog height
    // ref: AK-1723
    const SIZE_ENUM = {
      values: [
        'small',
        'medium',
        'large',
        'xlarge',
        'x-large',
        'maximum',
        'fullscreen',
      ],
      sizes: {
        small: '400px',
        medium: '600px',
        large: '800px',
        xlarge: '968px',
        'x-large': '968px',
        maximum: '100%',
        fullscreen: '100%',
      },
    };

    const getSize = (v: string) =>
      // @ts-ignore TODO: fix noImplicitAny error here
      SIZE_ENUM.values.indexOf(v) === -1 ? v : SIZE_ENUM.sizes[v];

    const iframeProps = {
      extension,
      height: getSize(height),
      width: '100%',
    };

    if (!chrome) {
      return (
        <DialogChromeless
          isOpen={isOpen}
          shouldCloseOnEscapePress={closeOnEscape}
          onClose={this.props.dismissDialog}
        >
          {this.getIframeComponent({
            ...iframeProps,
            width: getSize(width),
            defaultStyles: {
              pointerEvents: 'auto',
            },
          })}
        </DialogChromeless>
      );
    }
    const header = options.header
      ? ({ onClose, showKeyline }: any) => (
          <ModalHeader showKeyline={showKeyline}>
            {/* very strange @emotion/styled ts issue
            //@ts-ignore */}
            <ModalTitle>{options.header}</ModalTitle>
            <Button onClick={onClose} appearance="link" spacing="none">
              <CrossIcon
                label="Close Modal"
                primaryColor={colors.R400}
                size="small"
              />
            </Button>
          </ModalHeader>
        )
      : undefined;

    let footer;
    if (actions.length) {
      // These hint styles were copied from .aui-dialog2-footer-hint, but products can style them differently if
      // they wish.
      const hintStyles: CSSProperties = {
        color: '#707070',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingRight: '10px',
      };

      // @ts-ignore TODO: fix noImplicitAny error here
      footer = ({ showKeyline }) => (
        <ModalFooter showKeyline={showKeyline}>
          <div style={hintStyles}>{hint}</div>
          <ButtonGroup>
            {actions.map((action: any) =>
              action.hidden ? null : (
                <Button
                  id={action.identifier}
                  key={action.key}
                  appearance={this.getButtonAppearance(action.key)}
                  onClick={action.onClick}
                  isDisabled={action.disabled}
                >
                  {action.text}
                </Button>
              )
            )}
          </ButtonGroup>
        </ModalFooter>
      );
    }

    return (
      <ModalTransition>
        {isOpen && (
          <ModalDialog
            header={header}
            footer={footer}
            width={getSize(width)}
            height={getSize(height)}
            autoFocus={false}
            onClose={this.props.dismissDialog}
          >
            {this.getIframeComponent(iframeProps)}
          </ModalDialog>
        )}
      </ModalTransition>
    );
  }
}
