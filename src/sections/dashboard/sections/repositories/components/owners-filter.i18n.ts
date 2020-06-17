import { defineMessages } from 'react-intl';

export default defineMessages({
  filterOwner: {
    id: 'frontbucket.dashboard.repositories.ownerFilter',
    description:
      'Filter for showing the repositories which match the selected owner.',
    defaultMessage: 'Owner',
  },
  filterOwnerLoading: {
    id: 'frontbucket.dashboard.repositories.ownerFilter.loading',
    description:
      'Message shown in the owner filter when it is loading the initial option if the one is provided',
    defaultMessage: 'Loading ...',
  },
  filterOwnerNoOptions: {
    id: 'frontbucket.dashboard.repositories.ownerFilter.empty',
    description:
      'The message displayed in the owner filter when no owners are returned based on the search criteria',
    defaultMessage: 'Continue typing to search for an owner.',
  },
  filterOwnerError: {
    id: 'frontbucket.dashboard.repositories.ownerFilter.error',
    description:
      'The message displayed in the owner filter when the authors are failed to load',
    defaultMessage:
      'We couldn’t get the list of owners. Try refreshing the page.',
  },
});
