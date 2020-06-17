import './polyfills';

// This is imported first to enable us to catch as many exceptions as possible
import './sentry';

// This assignment to __webpack_nonce__ needs to happen before other imports
// to ensure that dynamically loaded modules use the CSP nonce
import './csp';

// This assignment to __webpack_public_path__ needs to happen before all other
// imports in order to have correct asset URL resolution
// see: https://webpack.js.org/guides/public-path/#on-the-fly
import './public-path';

import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { appWasServerSideRendered } from 'src/utils/ssr';
import App from './app/index';

if (process.env.NODE_ENV === 'development') {
  const qs = require('qs');
  const { wdyu, wdyr } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  // We previously used the "why-did-you-update" library, but that was
  // deprecated by its author in favour of "why-did-you-render". Keeping
  // the old "wdyu" support around in case people are used to using that.
  const wdyrTarget = wdyr || wdyu;

  if (wdyrTarget !== undefined) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    const ReactRedux = require('react-redux');
    whyDidYouRender(React, {
      include: [new RegExp(wdyrTarget)],
      trackExtraHooks: [[ReactRedux, 'useSelector']],
    });
  }
}
const rootEl: HTMLElement | null | undefined = document.getElementById('root');
if (rootEl) {
  if (appWasServerSideRendered()) {
    Loadable.preloadReady().then(() => {
      ReactDOM.render(<App />, rootEl);
    });
  } else {
    ReactDOM.render(<App />, rootEl);
  }
}
