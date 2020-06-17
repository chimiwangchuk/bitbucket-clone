import { Fragment } from 'prosemirror-model';
var getLanguageFromEditorStyle = function (dom) {
    return dom.getAttribute('data-language') || undefined;
};
// example of BB style:
// <div class="codehilite language-javascript"><pre><span>hello world</span><span>\n</span></pre></div>
var getLanguageFromBitbucketStyle = function (dom) {
    if (dom && dom.classList.contains('codehilite')) {
        // code block html from Bitbucket always contains an extra new line
        return extractLanguageFromClass(dom.className);
    }
    return;
};
// If there is a child code element, check that for data-language
var getLanguageFromCode = function (dom) {
    var firstChild = dom.firstElementChild;
    if (firstChild && firstChild.nodeName === 'CODE') {
        return firstChild.getAttribute('data-language') || undefined;
    }
};
var extractLanguageFromClass = function (className) {
    var languageRegex = /(?:^|\s)language-([^\s]+)/;
    var result = languageRegex.exec(className);
    if (result && result[1]) {
        return result[1];
    }
    return;
};
var removeLastNewLine = function (dom) {
    var parent = dom && dom.parentElement;
    if (parent && parent.classList.contains('codehilite')) {
        dom.textContent = dom.textContent.replace(/\n$/, '');
    }
    return dom;
};
export var codeBlock = {
    attrs: { language: { default: null }, uniqueId: { default: null } },
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [
        {
            tag: 'pre',
            preserveWhitespace: 'full',
            getAttrs: function (domNode) {
                var dom = domNode;
                var language = getLanguageFromBitbucketStyle(dom.parentElement) ||
                    getLanguageFromEditorStyle(dom.parentElement) ||
                    getLanguageFromCode(dom) ||
                    dom.getAttribute('data-language');
                dom = removeLastNewLine(dom);
                return { language: language };
            },
        },
        // Handle VSCode paste
        // Checking `white-space: pre-wrap` is too aggressive @see ED-2627
        {
            tag: 'div[style]',
            preserveWhitespace: 'full',
            getAttrs: function (domNode) {
                var dom = domNode;
                if (dom.style.whiteSpace === 'pre' ||
                    (dom.style.fontFamily &&
                        dom.style.fontFamily.toLowerCase().indexOf('monospace') > -1)) {
                    return {};
                }
                return false;
            },
            // @see ED-5682
            getContent: function (domNode, schema) {
                var dom = domNode;
                var code = Array.from(dom.children)
                    .map(function (child) { return child.textContent; })
                    .filter(function (x) { return x !== undefined; })
                    .join('\n');
                return code ? Fragment.from(schema.text(code)) : Fragment.empty;
            },
        },
        // Handle GitHub/Gist paste
        {
            tag: 'table[style]',
            preserveWhitespace: 'full',
            getAttrs: function (dom) {
                if (dom.querySelector('td[class*="blob-code"]')) {
                    return {};
                }
                return false;
            },
        },
        {
            tag: 'div.code-block',
            preserveWhitespace: 'full',
            getAttrs: function (domNode) {
                var dom = domNode;
                // TODO: ED-5604 Fix it inside `react-syntax-highlighter`
                // Remove line numbers
                var linesCode = dom.querySelector('code');
                if (linesCode &&
                    linesCode.querySelector('.react-syntax-highlighter-line-number')) {
                    // It's possible to copy without the line numbers too hence this
                    // `react-syntax-highlighter-line-number` check, so that we don't remove real code
                    linesCode.remove();
                }
                return {};
            },
        },
    ],
    toDOM: function (node) {
        return ['pre', ['code', { 'data-language': node.attrs.language }, 0]];
    },
};
export var toJSON = function (node) { return ({
    attrs: Object.keys(node.attrs).reduce(function (memo, key) {
        if (key === 'uniqueId') {
            return memo;
        }
        if (key === 'language' && node.attrs.language === null) {
            return memo;
        }
        memo[key] = node.attrs[key];
        return memo;
    }, {}),
}); };
//# sourceMappingURL=code-block.js.map