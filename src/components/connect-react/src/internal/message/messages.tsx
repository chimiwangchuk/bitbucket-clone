import React, { PureComponent } from 'react';
import Flag, { FlagGroup } from '@atlaskit/flag';
import { getIcon, Icons } from './utils';

export type FlagProps = {
  actions?: Array<{
    content: React.ReactNode;
    onClick?: () => void;
    href?: string;
    target?: string;
  }>;
  icon: string;
  id: number | string;
  title: string;
  body?: string;
  type: keyof Icons;
};

type MessagesProps = {
  actions: {
    dismissMessage: Function;
  };
  messages: FlagProps[];
};

export default class Messages extends PureComponent<MessagesProps> {
  props: MessagesProps;
  render() {
    return (
      <FlagGroup
        onDismissed={messageId => this.props.actions.dismissMessage(messageId)}
      >
        {this.props.messages.map(message => (
          <Flag
            id={message.id}
            key={message.id}
            title={message.title}
            description={message.body}
            actions={message.actions}
            icon={getIcon(message.type)}
          />
        ))}
      </FlagGroup>
    );
  }
}
