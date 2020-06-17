import { MessageProvider as ConnectMessageProvider } from '@atlassian/connect-module-core';
import { MessageCreationOptions } from '@atlassian/connect-module-core/src/modules/message/MessageCreationOptions';
import Message from './message';

export class MessageProvider implements ConnectMessageProvider {
  messageView: Message | null = null;

  generic = (
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    if (!this.messageView) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.messageView.createMessage(
      'generic',
      `Generic: ${title}`,
      body,
      messageCreationOptions
    );
  };

  hint = (
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    if (!this.messageView) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.messageView.createMessage(
      'hint',
      `Hint: ${title}`,
      body,
      messageCreationOptions
    );
  };

  info = (
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    if (!this.messageView) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.messageView.createMessage(
      'info',
      `Info: ${title}`,
      body,
      messageCreationOptions
    );
  };

  success = (
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    if (!this.messageView) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.messageView.createMessage(
      'success',
      `Success: ${title}`,
      body,
      messageCreationOptions
    );
  };

  warning = (
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    if (!this.messageView) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.messageView.createMessage(
      'warning',
      `Warning: ${title}`,
      body,
      messageCreationOptions
    );
  };

  error = (
    title: string,
    body: string,
    messageCreationOptions: MessageCreationOptions
  ) => {
    if (!this.messageView) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.messageView.createMessage(
      'error',
      `Error: ${title}`,
      body,
      messageCreationOptions
    );
  };

  clear = (messageId: string) => {
    if (!this.messageView) {
      return;
    }
    this.messageView.closeMessage(messageId);
  };

  onClose = (messageId: string, callback: any) => {
    if (!this.messageView) {
      return;
    }
    this.messageView.onClose(messageId, callback);
  };

  setView = (messageView: Message) => {
    this.messageView = messageView;
  };
}

export default new MessageProvider();
