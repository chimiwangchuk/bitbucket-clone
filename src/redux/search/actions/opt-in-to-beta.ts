import { createAsyncAction } from 'src/redux/actions';
import { User } from 'src/components/types';

export const OptInToBeta = createAsyncAction('search/OPT_IN_TO_BETA');

export default (account: User) => {
  const { uuid: accountUuid } = account;
  if (!accountUuid) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return {
    type: OptInToBeta.REQUEST,
    payload: {
      account,
    },
  };
};
