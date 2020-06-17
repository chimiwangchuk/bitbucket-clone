import { EmojiResource } from '@atlaskit/emoji';
import settings from 'src/settings';
import { IS_SERVER } from 'src/utils/ssr';

export const emojiUrl = settings.EMOJI_STANDARD_BASE_URL;

const createEmojiProvider = (): EmojiResource => {
  if (IS_SERVER) {
    return {} as any;
  }

  return new EmojiResource({
    providers: [
      {
        url: `${emojiUrl}standard`,
        // Workaround for FS-869, can put query params in url
        securityProvider: () => ({
          params: { maxVersion: 'VERSION_9_0' },
        }),
      },
    ],
  });
};

export const emojiProvider = Promise.resolve(createEmojiProvider());
