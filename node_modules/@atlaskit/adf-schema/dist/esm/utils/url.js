import LinkifyIt from 'linkify-it';
var whitelistedURLPatterns = [
    /^https?:\/\//im,
    /^ftps?:\/\//im,
    /^\//im,
    /^mailto:/im,
    /^skype:/im,
    /^callto:/im,
    /^facetime:/im,
    /^git:/im,
    /^irc6?:/im,
    /^news:/im,
    /^nntp:/im,
    /^feed:/im,
    /^cvs:/im,
    /^svn:/im,
    /^mvn:/im,
    /^ssh:/im,
    /^scp:\/\//im,
    /^sftp:\/\//im,
    /^itms:/im,
    /^notes:/im,
    /^hipchat:\/\//im,
    /^sourcetree:/im,
    /^urn:/im,
    /^tel:/im,
    /^xmpp:/im,
    /^telnet:/im,
    /^vnc:/im,
    /^rdp:/im,
    /^whatsapp:/im,
    /^slack:/im,
    /^sips?:/im,
    /^magnet:/im,
];
export var isSafeUrl = function (url) {
    return whitelistedURLPatterns.some(function (p) { return p.test(url.trim()) === true; });
};
var linkify = LinkifyIt();
linkify.add('sourcetree:', 'http:');
export function getLinkMatch(str) {
    var match = str && linkify.match(str);
    return match && match[0];
}
/**
 * Adds protocol to url if needed.
 */
export function normalizeUrl(url) {
    var match = getLinkMatch(url);
    return (match && match.url) || url;
}
//# sourceMappingURL=url.js.map