/* Stores a set of items that can be processed simultaneously after a set timeout.
 *
 * Example:
 *
 * // Create the batch, which returns the function to add items
 * const addToBatch = timedBatch(function processItems(items) {
 *  items.forEach(item => doSomethingWithItem(item));
 * }, { timeout: 5000 });
 *
 * // Add things to the batch. After the timeout (5000ms), these items will be
 * // passed to the callback as an array ([4, 2] in this example)
 * addToBatch(4);
 * addToBatch(2);
 *
 * If we call `addToBatch` again after that timeout, a new batch will be
 * created and only those new items will be processed.
 */
export default function timedBatch(
  callback: Function,
  options: { timeout?: number } = {}
) {
  // @ts-ignore TODO: fix noImplicitAny error here
  let batchTimeout;
  const batch: Array<any> = [];
  const timeout = options.timeout || 1000;

  // @ts-ignore TODO: fix noImplicitAny error here
  return function addToBatch(item) {
    batch.push(item);
    // @ts-ignore TODO: fix noImplicitAny error here
    clearTimeout(batchTimeout);

    batchTimeout = setTimeout(() => {
      callback(batch.slice());
      // clear the existing items
      batch.length = 0;
    }, timeout);
  };
}
