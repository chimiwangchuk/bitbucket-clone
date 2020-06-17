import React, { PureComponent, ReactNode } from 'react';
import Button from '@atlaskit/button';
import { FormattedMessage } from 'react-intl';
import GenericMessage from './generic-message';
import messages from './error-state.i18n';

type ErrorStateProps = {
  header?: ReactNode;
  description?: ReactNode;
  onClick?: () => void;
};

class ErrorState extends PureComponent<ErrorStateProps> {
  render() {
    const { header, description, onClick } = this.props;
    return (
      <GenericMessage
        iconType="error"
        title={header || <FormattedMessage {...messages.errorHeader} />}
      >
        {description || (
          <FormattedMessage tagName="p" {...messages.errorDescription} />
        )}
        {onClick && (
          <Button appearance="link" onClick={this.props.onClick}>
            <FormattedMessage {...messages.errorLink} />
          </Button>
        )}
      </GenericMessage>
    );
  }
}

export default ErrorState;
