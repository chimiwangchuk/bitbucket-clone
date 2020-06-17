import settings from './settings';
import cspNonce from './csp';

export const issueCollectors = settings.JIRA_ISSUE_COLLECTORS;

// Client-side navigation might leave unecessary issue collector
// scripts on the page so remove them.  This code assumes there
// should only ever been one feedback button and therefore 1 Jira
// Issue Collector per page.
const removeExtraJiraIssueCollectors = (issueCollectorId: string): void => {
  const issueCollectorScripts = Array.from(
    document.querySelectorAll('script[data-issue-collector]')
  );

  const extraCollectors = issueCollectorScripts.filter(issueCollectorScript => {
    const issueCollectorScriptId =
      // @ts-ignore TODO: fix noImplicitAny error here
      issueCollectorScript.attributes['data-issue-collector'].value;
    return issueCollectorScriptId !== issueCollectorId;
  });

  extraCollectors.forEach(element => {
    element.remove();
  });
};

const removeExtraElements = (elementId: string): void => {
  const elements = document.querySelectorAll(elementId);
  if (elements.length > 0) {
    elements.forEach((element, index) => {
      if (index > 0) {
        element.remove();
      }
    });
  }
};

export const initializeJiraIssueCollector = (
  issueCollectorName: string,
  additionalFieldValues?: { [key: string]: string }
) => {
  // @ts-ignore TODO: fix noImplicitAny error here
  const issueCollector = issueCollectors[issueCollectorName];

  if (issueCollector) {
    const issueCollectorId: string = issueCollector.id;
    const issueCollectorUrl: string = issueCollector.url;

    removeExtraJiraIssueCollectors(issueCollectorId);

    const isIssueCollectorAlreadyInitialized = document.querySelector(
      `script[data-issue-collector="${issueCollectorId}"]`
    );

    // For client-side navigation make sure this specific Jira Issue
    // Collector isn't already initialized.  If it is don't do it again.
    if (!isIssueCollectorAlreadyInitialized) {
      // initialize issue collector variables
      window.__jira_issue_collector_trigger_fns__ =
        window.__jira_issue_collector_trigger_fns__ || {};
      window.ATL_JQ_PAGE_PROPS = window.ATL_JQ_PAGE_PROPS || {};

      // initialize the specific issue collector
      window.ATL_JQ_PAGE_PROPS[issueCollectorId] =
        window.ATL_JQ_PAGE_PROPS[issueCollectorId] || {};

      // setup the trigger function
      window.ATL_JQ_PAGE_PROPS[
        issueCollectorId
        // @ts-ignore TODO: fix noImplicitAny error here
      ].triggerFunction = showCollectorDialog => {
        (window.__jira_issue_collector_trigger_fns__ as any)[
          issueCollectorId
        ] = showCollectorDialog;
      };

      // Hidden fields must be set as fieldValues before the script is initialized
      // https://confluence.atlassian.com/adminjiracloud/advanced-use-of-the-jira-issue-collector-788726105.html#AdvanceduseoftheJIRAissuecollector-Hiddenfields
      if (additionalFieldValues) {
        window.ATL_JQ_PAGE_PROPS[issueCollectorId].fieldValues = () => ({
          ...window.ATL_JQ_PAGE_PROPS[issueCollectorId].fieldValues,
          ...additionalFieldValues,
        });
      }

      // Dynamically inject the issue collector script after all configuration
      // has been done above.  This is necessary so that hidden field values,
      // as an example, are set properly into the issue collector form.
      const issueCollectorScript = document.createElement('script');
      issueCollectorScript.setAttribute('nonce', cspNonce);
      issueCollectorScript.defer = true;
      issueCollectorScript.setAttribute(
        'data-issue-collector',
        issueCollectorId
      );
      issueCollectorScript.src = issueCollectorUrl;
      document.head.appendChild(issueCollectorScript);
    }

    setTimeout(() => {
      // Remove extra AUI container & blanket elements if there are any
      // after the issue collector script loads & injects them.
      // This isn't critical to do but is nice for a11y scores
      // (can't have more than 1 element of the same ID on a page).
      removeExtraElements('#atlwdg-blanket');
      removeExtraElements('#atlwdg-container');
    }, 3000);
  }
};
