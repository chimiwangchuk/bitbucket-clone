import React, { ReactNode, useState, memo } from 'react';
import ModalDialog, {
  ModalTransition,
  HeaderComponentProps,
} from '@atlaskit/modal-dialog';
import { WidthNames } from '@atlaskit/modal-dialog/dist/cjs/shared-variables';
import Button, { ButtonGroup, ButtonProps } from '@atlaskit/button';
import { useIntl } from 'src/hooks/intl';
import { useAutofocus } from 'src/hooks/use-auto-focus';
import { ModalBody, Step, FooterWrapper } from './styles';
import { buttonTheme, purpleTheme } from './utils';
import messages from './shared.i18n';

export type Action = ButtonProps;

export type Step = {
  header?:
    | React.ComponentClass<HeaderComponentProps, any>
    | React.FunctionComponent<HeaderComponentProps>;
  heading: string;
  children: ReactNode | string;
  action?: (props: { next: () => void }) => Action;
};

export type Props = {
  steps: Step[];
  defaultStep?: number;
  width?: number | string | WidthNames;
  onDismiss?: () => void;
};

export const StepModal = memo(
  ({ steps, defaultStep = 0, width = 500, onDismiss }: Props) => {
    const [step, setStep] = useState<number>(defaultStep);
    const intl = useIntl();
    const activeStep = steps[step];
    const close = () => {
      setStep(-1);
      if (typeof onDismiss === 'function') {
        onDismiss();
      }
    };
    const next = () =>
      setStep(currentStep =>
        currentStep >= steps.length - 1 ? 0 : currentStep + 1
      );
    const action =
      activeStep && activeStep.action ? activeStep.action({ next }) : null;
    const btnTheme = buttonTheme(purpleTheme);

    const Footer = () => {
      const autoFocusRef = useAutofocus();
      return (
        <FooterWrapper>
          <Step>
            {step + 1}/{steps.length}
          </Step>
          <ButtonGroup>
            <Button appearance="subtle" onClick={close}>
              {intl.formatMessage(messages.dismissButtonText)}
            </Button>
            {action ? (
              <Button theme={btnTheme} ref={autoFocusRef} {...action} />
            ) : (
              <Button theme={btnTheme} onClick={next} ref={autoFocusRef}>
                {intl.formatMessage(messages.nextButtonText)}
              </Button>
            )}
          </ButtonGroup>
        </FooterWrapper>
      );
    };
    return (
      <ModalTransition>
        {step >= 0 && activeStep && (
          <ModalDialog
            width={width}
            components={{ Header: activeStep.header, Footer }}
            autoFocus={false}
          >
            <ModalBody>
              <h3>{activeStep.heading}</h3>
              <p>{activeStep.children}</p>
            </ModalBody>
          </ModalDialog>
        )}
      </ModalTransition>
    );
  }
);
