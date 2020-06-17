import { AbstractMentionResource } from '@atlaskit/mention';
import { InjectedIntl } from 'react-intl';
import { hasDistinctDisplayName } from 'src/utils/display-name-with-nickname';
import authRequest from 'src/utils/fetch';
import urls from '../urls';
import messages from './bb-mentions-provider.i18n';

let lastOwner: string | null = null;
let lastSlug: string | null = null;
let memoizedKlazz: any = null;

// @ts-ignore TODO: fix noImplicitAny error here
export const transformUserToMention = rawUser => {
  const mentionData = {
    id: `{${rawUser.mention_id}}`,
    avatarUrl: rawUser.avatar_url,
    name: rawUser.display_name,
    mentionName: rawUser.username,
    nickname: undefined,
    lozenge: rawUser.is_teammate ? 'teammate' : '',
  };

  if (hasDistinctDisplayName(rawUser.display_name, rawUser.nickname)) {
    mentionData.nickname = rawUser.nickname;
  }

  return mentionData;
};

export type MentionsBuildArgs = {
  owner: string;
  slug: string;
  intl: InjectedIntl;
};

const build = ({ owner, slug, intl }: MentionsBuildArgs) => {
  if (lastOwner === owner && lastSlug === slug && memoizedKlazz) {
    return memoizedKlazz;
  }

  lastOwner = owner;
  lastSlug = slug;
  memoizedKlazz = class MentionProviderImpl extends AbstractMentionResource {
    async filter(query: string) {
      if (query.length < 3) {
        const continueTyping = intl.formatMessage(messages.continueTyping);
        // eslint-disable-next-line no-underscore-dangle
        this._notifyInfoListeners(continueTyping);
        return;
      }

      const url = urls.ui.repositoryMentions(owner, slug, query);

      try {
        const response = await fetch(authRequest(url));

        if (!response.ok) {
          const errorMessage = intl.formatMessage(messages.error);
          throw new Error(errorMessage);
        }

        const rawResults = await response.json();

        if (rawResults.length === 0) {
          const noMatches = intl.formatMessage(messages.noMatches, { query });
          // eslint-disable-next-line no-underscore-dangle
          this._notifyInfoListeners(noMatches);
          return;
        }

        // @ts-ignore TODO: fix noImplicitAny error here
        const mentions = rawResults.map(rawUser =>
          transformUserToMention(rawUser)
        );
        // eslint-disable-next-line no-underscore-dangle
        this._notifyListeners({ mentions, query });
        // eslint-disable-next-line no-underscore-dangle
        this._notifyAllResultsListeners({ mentions, query });
      } catch (e) {
        // eslint-disable-next-line no-underscore-dangle
        this._notifyErrorListeners(e.message);
      }
    }
  };

  return memoizedKlazz;
};

export const BitbucketMentionsProvider = { build };
