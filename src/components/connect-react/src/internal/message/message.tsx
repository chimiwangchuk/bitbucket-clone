import React, { PureComponent } from 'react';
import { MessageCreationOptions } from '@atlassian/connect-module-core/src/modules/message/MessageCreationOptions';
import Messages from './messages';
import { MessageProvider } from './provider';

type MessageProps = {
  connectHost: any; // TODO: add a type for connectHost
  messageProvider: MessageProvider;
};

type MessageState = {
  messages: any[];
};

export default class Message extends PureComponent<MessageProps, MessageState> {
  props: MessageProps;

  state: MessageState = {
    messages: [], // using an array keeps the messages ordered
  };

  componentDidMount() {
    this.props.messageProvider.setView(this);
  }

  componentDidUpdate() {
    this.props.messageProvider.setView(this);
  }

  messageIdsToCloseHandlers = {};

  /**
   * @param messageCreationOptions - for type info, see @atlassian/connect-module-core/lib/modules/message/MessageCreationOptions.
   */
  createMessage = (
    type: string,
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    const message = {
      id: messageCreationOptions.id,
      key: messageCreationOptions.id,
      type,
      title,
      body,
      closeable: messageCreationOptions.closeable,
      fadeout: messageCreationOptions.fadeout,
      delay: messageCreationOptions.delay,
      duration: messageCreationOptions.duration,
    };
    this.setState({
      messages: this.state.messages.concat([message]),
    });
    return message;
  };

  closeMessage = (messageId: string) => {
    this.state.messages.forEach(message => {
      if (message.id === messageId) {
        // @ts-ignore TODO: fix noImplicitAny error here
        const closeHandler = this.messageIdsToCloseHandlers[messageId];
        if (closeHandler) {
          try {
            closeHandler();
          } catch (exception) {
            throw new Error('Message close handler threw an exception');
          }
          // @ts-ignore TODO: fix noImplicitAny error here
          delete this.messageIdsToCloseHandlers[messageId];
        }
      }
    });
    const newMessages = this.state.messages.filter(
      message => message.id !== messageId
    );
    this.setState({
      messages: newMessages,
    });
  };

  onClose = (messageId: string, callback: any) => {
    // @ts-ignore TODO: fix noImplicitAny error here
    this.messageIdsToCloseHandlers[messageId] = callback;
  };

  render() {
    return (
      <Messages
        messages={this.state.messages}
        actions={{
          dismissMessage: this.closeMessage,
        }}
      />
    );
  }
}
