const TAG_NAME = 'em';
const WRONG_OPERATORS = '\\bAND\\b|\\bOR\\b';
const WRONG_EXTENSION = '\\bext:\\w+\\.\\w+\\b';
const QUOTES = '(\\s|^)"(\\\\.|[^"\\\\])*"(?=\\s|$)';

export const FORM_KEY = 'search-query-form';
export const SEARCH_RESULT_MATCH_TAG = TAG_NAME;
export const SEARCH_SYNTAX_WRONG_OPERATORS = new RegExp(WRONG_OPERATORS, 'g');
export const SEARCH_SYNTAX_WRONG_EXTENSION = new RegExp(WRONG_EXTENSION, 'g');
export const SEARCH_SYNTAX_QUOTES = new RegExp(QUOTES, 'g');
export const SEARCH_RECENT_LOCALSTORAGE_KEY = 'search.recent-account';
