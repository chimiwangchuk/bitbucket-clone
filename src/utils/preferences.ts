import authRequest from 'src/utils/fetch';
import profileUrls from 'src/urls/profile';

export type PreferenceKey = string | number | boolean;

export default {
  get: (uuid: string, key: PreferenceKey): Promise<any> => {
    const url = profileUrls.api.internal.userPreference(
      uuid,
      encodeURIComponent(key.toString())
    );

    if (!uuid) {
      return Promise.reject();
    }

    return fetch(authRequest(url)).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // If the response status is 404, it means the preference has not been set yet.
        // It makes more sense to resolve the promise with a value`undefined` instead of rejecting it.
        if (response.status === 404) {
          return Promise.resolve(undefined);
        }
      }
      return Promise.reject();
    });
  },

  set: (uuid: string, key: PreferenceKey, value: any): Promise<any> => {
    const url = profileUrls.api.internal.userPreference(
      uuid,
      encodeURIComponent(key.toString())
    );

    if (!uuid) {
      return Promise.reject();
    }

    const data = new FormData();
    data.append('value', value);

    return fetch(
      authRequest(url, {
        method: 'PUT',
        body: data,
      })
    ).then(response => (response.ok ? response.json() : Promise.reject()));
  },

  delete: (uuid: string, key: PreferenceKey): Promise<void> => {
    const url = profileUrls.api.internal.userPreference(
      uuid,
      encodeURIComponent(key.toString())
    );

    if (!uuid) {
      return Promise.reject();
    }

    return fetch(authRequest(url, { method: 'DELETE' })).then(response =>
      response.ok ? Promise.resolve() : Promise.reject()
    );
  },
};
