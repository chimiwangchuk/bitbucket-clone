import { ProviderFactory } from '@atlaskit/editor-common';
import { emojiProvider } from './bb-emoji-provider';

const providerFactory = new ProviderFactory();
providerFactory.setProvider('emojiProvider', emojiProvider);

export { providerFactory };
