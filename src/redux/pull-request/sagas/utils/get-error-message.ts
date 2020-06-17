import { call } from 'redux-saga/effects';

const contentTypeMatchers = {
  html: /html/,
  json: /json/,
};

export function* getErrorMessage(response: Response) {
  const contentType = response.headers.get('Content-Type') || '';

  if (contentTypeMatchers.json.test(contentType)) {
    const json = yield response.json();

    return json.error.message;
  }

  const text = yield response.text();

  if (contentTypeMatchers.html.test(contentType)) {
    const domParser = new DOMParser();
    const doc = yield call(
      { context: domParser, fn: domParser.parseFromString },
      text,
      'text/html'
    );
    const content = doc.getElementById('content');
    const innerText = content ? content.innerText : doc.body.innerText;
    const [result] = innerText.trim().split('\n');

    return result;
  }

  return text;
}
