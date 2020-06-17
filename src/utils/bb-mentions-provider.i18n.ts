import { defineMessages } from 'react-intl';

export default defineMessages({
  continueTyping: {
    id: 'frontbucket.global.mentions.continueTyping',
    description: 'Mentions label to continue typing more characters.',
    defaultMessage: 'Continue typing to search for a user',
  },
  noMatches: {
    id: 'frontbucket.global.mentions.noMatches',
    description: 'Mentions label for no results found.',
    defaultMessage: 'Found no matches for {query}',
  },
  error: {
    id: 'frontbucket.global.mentions.error',
    description: 'Generic error message for mentions.',
    defaultMessage: 'No results could be retrieved',
  },
});
