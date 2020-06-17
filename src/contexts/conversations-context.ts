import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';

import { ConversationProvider } from 'src/components/conversation-provider';
import {
  FabricConversation,
  ProviderConfig,
} from 'src/components/conversation-provider/types';
import { providerFactory } from 'src/components/fabric-html-renderer';
import {
  BitbucketMentionsProvider,
  MentionsBuildArgs,
} from 'src/utils/bb-mentions-provider';
import { buildProfilecardProvider } from 'src/utils/bb-profilecard-provider';

export interface ConversationsContextInterface {
  conversationProvider: ConversationProvider | any;
  additionalConversationProviders: ProviderFactory;
}

const ConversationsContext = React.createContext<ConversationsContextInterface>(
  {
    conversationProvider: null,
    additionalConversationProviders: providerFactory,
  }
);

export default ConversationsContext;

type ConversationContextBuildArgs = Omit<ProviderConfig, 'user'> &
  MentionsBuildArgs & {
    areProfileCardsEnabled?: boolean;
    fabricConversations: FabricConversation[];
    userAvatarUrl: string | undefined;
    userDisplayName: string | undefined;
    userProfileUrl: string | undefined;
    userUuid: string | undefined;
  };

export function buildConversationContext({
  anchor,
  areProfileCardsEnabled,
  destRev,
  userAvatarUrl,
  userDisplayName,
  userProfileUrl,
  userUuid,
  urls,
  onAddComment,
  onDeleteComment,
  owner,
  slug,
  intl,
  fabricConversations,
}: ConversationContextBuildArgs) {
  // Providers only AGGREGATE conversations, so if there's updates & deletes etc
  // then the only way I could find to ensure we re-render was to create a fresh
  // provider and reboot its internal store with a called to getConversations().
  const conversationProvider = ConversationProvider.getProvider({
    anchor,
    destRev,
    // @ts-ignore This is an intentionally incomplete BB.User object
    user: {
      uuid: userUuid,
      display_name: userDisplayName,
      links: {
        html: {
          href: userProfileUrl || '#',
        },
        avatar: {
          href: userAvatarUrl || '#',
        },
      },
    },
    urls,
    onAddComment,
    onDeleteComment,
  });

  // This builder is memoized so we just call it each time
  const MentionProvider = BitbucketMentionsProvider.build({
    owner,
    slug,
    intl,
  });

  if (areProfileCardsEnabled) {
    const profilecardProvider = buildProfilecardProvider({ intl });
    providerFactory.setProvider('profilecardProvider', profilecardProvider);
  }

  providerFactory.setProvider(
    'mentionProvider',
    Promise.resolve(new MentionProvider())
  );
  // Needed here to bootstrap internal conversations store
  conversationProvider.getConversations(fabricConversations);

  return {
    conversationProvider,
    additionalConversationProviders: providerFactory,
  };
}
