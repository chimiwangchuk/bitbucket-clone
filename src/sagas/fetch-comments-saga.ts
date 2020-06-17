import { call } from 'redux-saga/effects';
import authRequest from 'src/utils/fetch';

export type FetchCommentsProps = {
  url: string;
};

export function* fetchComments({ url }: FetchCommentsProps) {
  try {
    const response: Response = yield call(fetch, authRequest(url));

    if (!response.ok) {
      throw new Error('An error occured while fetching conversations');
    }

    const json = yield response.json();

    const commentValues = json.values;

    const nextUrl = json.next;

    return {
      commentValues,
      nextUrl,
    };
  } catch (e) {
    return { error: e };
  }
}
