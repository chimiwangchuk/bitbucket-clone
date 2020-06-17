import { Product } from '../types';

export const defaultXFlowUrl = {
  [Product.Bitbucket]: 'https://bitbucket.org',
  [Product.Confluence]:
    'https://www.atlassian.com/software/confluence?utm_source=bitbucket&utm_medium=in_product_ad&utm_campaign=bitbucket_app_switcher&utm_content=conf_integrations',
  [Product.JiraServiceDesk]:
    'https://www.atlassian.com/software/jira/service-desk?utm_source=bitbucket&utm_medium=in_product_ad&utm_campaign=bitbucket_app_switcher&utm_content=jsd_integrations',
  [Product.JiraSoftware]:
    'https://www.atlassian.com/software/jira/bitbucket-integration?utm_source=bitbucket&utm_medium=in_product_ad&utm_campaign=bitbucket_app_switcher&utm_content=integrations',
  [Product.Opsgenie]:
    'https://www.atlassian.com/software/opsgenie/bitbucket-integration?utm_source=bitbucket&utm_medium=in_product_ad&utm_campaign=bitbucket_app_switcher&utm_content=opsgenie_integrations',
};
