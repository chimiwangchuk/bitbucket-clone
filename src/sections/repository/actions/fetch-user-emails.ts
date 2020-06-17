import { fetchAction } from 'src/redux/actions';

import { FetchUserEmails } from 'src/sections/repository/actions/constants';
import urls from '../urls';

const fetchUserEmails = () =>
  fetchAction(FetchUserEmails, {
    url: `${urls.api.v20.email()}`,
  });

export default fetchUserEmails;
