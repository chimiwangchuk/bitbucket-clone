import React, { PureComponent } from 'react';
import Button from '@atlaskit/button';
import { FormattedMessage } from 'react-intl';

import { CloneClientType, CloneClientEvent } from '../types';
import messages from '../i18n';
import * as styles from '../styles';

export type CloneClientProps = {
  client: CloneClientType;
  clientHref: string;
  currentOS: string;
  cloneHref: string | undefined;
  onCloneClient: CloneClientEvent | undefined;
};

export default class CloneClient extends PureComponent<CloneClientProps> {
  render() {
    const {
      client,
      clientHref,
      currentOS,
      cloneHref,
      onCloneClient,
    } = this.props;
    // @ts-ignore TODO: fix noImplicitAny error here
    const cloneMessage = messages[`cloneIn${client}Link`];
    // @ts-ignore TODO: fix noImplicitAny error here
    const clientHrefMessage = messages[`cloneIn${client}Msg`];
    return (
      cloneHref && (
        <styles.CloneClient>
          {clientHrefMessage && (
            <FormattedMessage
              {...clientHrefMessage}
              values={{
                currentOS,
                link: (
                  <a href={clientHref} target="_blank">
                    {client}
                  </a>
                ),
              }}
            />
          )}
          {cloneMessage && (
            <styles.ButtonGroup>
              <Button
                href={cloneHref}
                onClick={
                  onCloneClient && (event => onCloneClient(client, event))
                }
              >
                <FormattedMessage {...cloneMessage} />
              </Button>
            </styles.ButtonGroup>
          )}
        </styles.CloneClient>
      )
    );
  }
}
