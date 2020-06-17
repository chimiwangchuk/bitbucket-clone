import { __awaiter, __generator } from "tslib";
import getDeviceInfo from './getDeviceInfo';
import getBrowserInfo from './getBrowserInfo';
var JIRA_ISSUE_COLLECTOR_URL = 'https://product-fabric.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-w0bwo4/b/14/e73395c53c3b10fde2303f4bf74ffbf6/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=98644b9c';
var loadJiraCollectorDialogScript = function (labels, packageName, coreVersion, packageVersion) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (window.jQuery) {
                window.ATL_JQ_PAGE_PROPS = {
                    triggerFunction: function (showCollectorDialog) {
                        if (typeof showCollectorDialog === 'function') {
                            resolve(showCollectorDialog);
                        }
                        else {
                            reject('Failed to initialize showCollectorDialog');
                        }
                    },
                    fieldValues: {
                        description: "Please describe the problem you're having or feature you'd like to see:\n\n\n",
                        // 11711 is the field ID for the Feedback Labels field on Product Fabric.
                        // this is found by clicking "configure" on the field and inspecting the URL
                        customfield_11711: labels || [],
                        customfield_11712: "version: " + packageName + "@" + packageVersion + " (" + coreVersion + ")\n              Browser: " + getBrowserInfo(navigator.userAgent) + "\n              OS: " + getDeviceInfo(navigator.userAgent, navigator.appVersion),
                    },
                    environment: {
                        'Editor Package': packageName,
                        'Editor Version': packageVersion,
                        'Editor Core Version': coreVersion,
                    },
                    priority: '1',
                    components: '15306',
                };
                window.jQuery.ajax({
                    url: JIRA_ISSUE_COLLECTOR_URL,
                    type: 'get',
                    cache: true,
                    dataType: 'script',
                });
            }
            else {
                reject('jQuery is not defined');
            }
            return [2 /*return*/];
        });
    }); });
};
export default loadJiraCollectorDialogScript;
//# sourceMappingURL=loadJiraCollectorDialogScript.js.map