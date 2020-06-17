// @ts-ignore TODO: fix noImplicitAny error here
import jQuery from 'jquery';

// FIXME remove this when atlassian-connect-js addresses this.
// atlassian-connect-js has a dependency on AUI and a global jquery, which is a
// dependency of bitbucket-connect-js
// ACJS-807
window.$ = window.jQuery = jQuery;
require('@atlassian/aui/dist/aui/js/aui');
