import { call } from 'redux-saga/effects';
import { parse, stringify } from 'qs';

export const getUrlForPage = (url: string, page: number, pagelen: number) => {
  const [baseUrl, search] = url.split('?');
  return `${baseUrl}?${stringify({
    ...parse(search || '', { ignoreQueryPrefix: true }),
    page,
    pagelen,
  })}`;
};

export function* fetchAllPagesWithAccessToken(
  url: string,
  accessToken: { token: string },
  pagelen = 10
) {
  // @ts-ignore TODO: fix noImplicitAny error here
  let values = [];
  let morePagesAvailable = true;
  let currentPage = 0;

  while (morePagesAvailable) {
    currentPage++;
    const response = yield call(
      fetch,
      getUrlForPage(url, currentPage, pagelen),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken.token}` },
      }
    );
    if (!response.ok) {
      throw Error(
        `Response failed with text - ${response.statusText}, status: ${response.status}`
      );
    }
    const json = yield response.json();
    // @ts-ignore TODO: fix noImplicitAny error here
    values = values.concat(json.values);
    morePagesAvailable = json.size > currentPage * pagelen;
  }
  return values;
}

export default function* fetchWithAccessToken(
  url: string,
  accessToken: { token: string },
  returnValuesField = true
) {
  const response = yield call(fetch, url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken.token}` },
  });
  if (!response.ok) {
    throw Error(
      `Response failed with text - ${response.statusText}, status: ${response.status}`
    );
  }
  const json = yield response.json();
  return returnValuesField ? json.values : json;
}
