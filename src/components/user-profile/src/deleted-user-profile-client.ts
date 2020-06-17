import { ProfileClient } from '@atlaskit/profilecard';

export default class DeletedUserProfileClient extends ProfileClient {
  // @ts-ignore (TS thinks that @atlaskit/profilecard defines this as an instance member property vs. an instance member function)
  makeRequest() {
    return Promise.resolve({ status: 'closed' });
  }
}
