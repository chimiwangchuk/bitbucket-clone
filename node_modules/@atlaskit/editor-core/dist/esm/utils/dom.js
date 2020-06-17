/**
 * Walks a DOM tree up to the provided `stopElement`, or if falsy before.
 * @param element
 * @param stopElement
 */
export function walkUpTreeUntil(element, shouldStop) {
    var rootElement = element;
    while (rootElement && rootElement.parentElement && !shouldStop(rootElement)) {
        rootElement = rootElement.parentElement;
    }
    return rootElement;
}
/**
 * Takes all children out from wrapped el and puts them directly inside
 * the parent el, at the wrapped el's position
 */
export function unwrap(parent, wrapped) {
    var docsFragment = document.createDocumentFragment();
    Array.from(wrapped.children).forEach(function (child) {
        docsFragment.appendChild(child);
    });
    parent.replaceChild(docsFragment, wrapped);
}
/**
 * Walks up DOM removing elements if they are empty until it finds
 * one that is not
 */
export function removeNestedEmptyEls(el) {
    while (el.parentElement &&
        el.childElementCount === 0 &&
        el.textContent === '') {
        var parentEl = el.parentElement;
        parentEl.removeChild(el);
        el = parentEl;
    }
}
/**
 * IE11 doesn't support classList to SVGElements
 **/
export var containsClassName = function (node, className) {
    if (!node) {
        return false;
    }
    if (node.classList && node.classList.contains) {
        return node.classList.contains(className);
    }
    if (!node.className) {
        return false;
    }
    var classNames = typeof node.className.baseVal === 'string'
        ? node.className.baseVal
        : node.className;
    return classNames.split(' ').indexOf(className) !== -1;
};
//# sourceMappingURL=dom.js.map