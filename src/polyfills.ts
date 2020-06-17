// This will get expanded by babel-preset-env's useBuiltins so we only get the polyfills needed
// for our targeted browsers.
import '@babel/polyfill';
import 'whatwg-fetch';
import 'intersection-observer';

// polyfill .remove() for any element in DOM (specifically for IE11)
// https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
// https://caniuse.com/#search=.remove
if (!Element.prototype.remove) {
  Element.prototype.remove = function remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}
