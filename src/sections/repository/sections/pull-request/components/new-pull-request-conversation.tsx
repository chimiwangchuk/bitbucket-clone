import React from 'react';
import { Conversation as AkConversation } from '@atlaskit/conversation';
import { PullRequestConversation } from './pull-request-conversation';

type AkConvoProps = JSX.LibraryManagedAttributes<
  typeof AkConversation,
  AkConversation['props']
>;

type Props = Partial<AkConvoProps> & {
  popupMountElement?: HTMLElement | null;
  meta: {
    path: string;
    to?: number;
    from?: number;
  };
};

export const BasePullRequestNewConversation = (props: Props) => {
  return <PullRequestConversation {...props} isExpanded />;
};

export const NewPullRequestConversation = React.memo(
  BasePullRequestNewConversation
);
