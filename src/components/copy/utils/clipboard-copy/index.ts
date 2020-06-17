// Modified version of https://github.com/feross/clipboard-copy

export default function copy(text: string) {
  // A <span> contains the text to copy
  const span = document.createElement('span');
  span.textContent = text;
  span.style.whiteSpace = 'pre'; // Preserve consecutive spaces and newlines

  // An <iframe> isolates the <span> from the page's styles
  const iframe = document.createElement('iframe');
  iframe.sandbox.add('allow-same-origin');
  if (document.body) {
    document.body.appendChild(iframe);
  }

  // TSC: Assuming this is always true given the context of its usage
  let win: Window = iframe.contentWindow!;
  win.document.body.appendChild(span);

  let selection = win.getSelection();

  // Fallback if the browser fails to get a selection from <iframe> window
  if ((selection && selection.rangeCount === 0) || !selection) {
    win = window;
    // TSC: Another assumed true situation
    selection = win.getSelection()!;
    if (document.body) {
      document.body.appendChild(span);
    }
  }

  const range = win.document.createRange();
  selection.removeAllRanges();
  range.selectNode(span);
  selection.addRange(range);

  // If there's other content on the page that is selected, FF will copy that instead
  // If preservation of that selection is desired, use https://github.com/sudodoki/toggle-selection
  if (document.activeElement) {
    // @ts-ignore Assumed true here too
    document.activeElement.blur();
  }

  let success = false;
  try {
    success = win.document.execCommand('copy');
  } catch (err) {
    // catch the exception
  }

  selection.removeAllRanges();
  win.document.body.removeChild(span);
  if (document.body) {
    document.body.removeChild(iframe);
  }

  return success;
}
