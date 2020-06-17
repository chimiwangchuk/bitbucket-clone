import { defineMessages } from 'react-intl';

export default defineMessages({
  watchedRepository: {
    id: 'frontbucket.repository.source.watchedRepository',
    description: 'Message when you have started watching a repository',
    defaultMessage: 'You are now watching this repository.',
  },
  unwatchedRepository: {
    id: 'frontbucket.repository.source.unwatchedRepository',
    description: 'Message when you have stopped watching a repository',
    defaultMessage: 'You are no longer watching this repository.',
  },
});
