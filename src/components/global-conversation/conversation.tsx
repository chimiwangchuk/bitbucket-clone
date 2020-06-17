import React from 'react';
import { Conversation as AkConversation } from '@atlaskit/conversation';

import { usePortalContainer } from 'src/hooks/use-portal-container';

type AkConversationProps = JSX.LibraryManagedAttributes<
  typeof AkConversation,
  AkConversation['props']
>;

type BaseProps = { portalParentId?: string };
type Props = AkConversationProps & BaseProps;

const Conversation: React.FC<Props> = (props: Props) => {
  const portal = usePortalContainer(props.portalParentId);
  return <AkConversation {...props} portal={portal} />;
};

export default Conversation;
