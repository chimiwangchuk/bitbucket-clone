import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import AkSpinner from '@atlaskit/spinner';
import { get } from 'lodash-es';
import Button from '@atlaskit/button';
import messages from 'src/connect/shared/loading.i18n';
import { Container, Spinner } from './loading.style';

type ConnectLoadingIndicatorProps = {
  action: 'loading' | 'timeout' | 'failed';
  delay: number; // how long to delay rendering spinner
  module?: any; // TODO: export types from @atlassian/bitbucket-connect-react - https://softwareteams.atlassian.net/browse/BBCC-1058
  failedCallback?: (e: React.MouseEvent) => void; // used when action is "timeout"
};

type ConnectLoadingIndicatorState = {
  delay: number;
};

export default class ConnectLoadingIndicator extends PureComponent<
  ConnectLoadingIndicatorProps,
  ConnectLoadingIndicatorState
> {
  timeout: NodeJS.Timer;
  static defaultProps = {
    action: 'loading',
    delay: 0,
  };
  state = {
    delay: this.props.delay,
  };
  componentDidMount() {
    const { delay } = this.state;
    if (delay) {
      this.timeout = setTimeout(() => this.setState({ delay: 0 }), delay);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    const { delay } = this.state;
    const { action, module: mod, failedCallback } = this.props;

    if (action === 'loading' && delay) {
      return false;
    }

    const appName = get(mod, 'app_name', get(mod, 'app_key', ''));
    const appBaseUrl = get(mod, 'app_base_url', get(mod, 'source.url', ''));
    return (
      <Container>
        {action === 'loading' && (
          <Spinner>
            <AkSpinner size="small" delay={0} />
          </Spinner>
        )}
        {appName && appBaseUrl && (
          <FormattedMessage
            {...messages[action]}
            values={{
              link: (
                <a href={appBaseUrl} target="_blank">
                  {appName}
                </a>
              ),
              action: action === 'timeout' && (
                <Button
                  appearance="link"
                  spacing="none"
                  onClick={failedCallback}
                >
                  <FormattedMessage {...messages.cancelText} />
                </Button>
              ),
            }}
          />
        )}
      </Container>
    );
  }
}
