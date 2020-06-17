/**
 * Executing code during ComponentDidUpdate is insufficient to
 * ensure that a component has finished rendering in the real DOM at the
 * point the code executes.  This is a workaround:
 *
 *   - let the React call stack clear out using setTimeout(func, 0)
 *     https://stackoverflow.com/a/34999925
 *
 *   - it can take more than one requestAnimationFrame paint cycle for a component to finish painting.
 *     https://stackoverflow.com/questions/26556436/react-after-render-code#comment64053397_34999925
 *
 * See also:
 * https://staging.bb-inf.net/bitbucket/frontbucket/pull-requests/773/bbcdev-9153-capture-custom-metric-for-time/activity#comment-1128853
 *
 */
export default function waitForReactRender(func: () => any, delay = 0) {
  setTimeout(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(func));
  }, delay);
}
