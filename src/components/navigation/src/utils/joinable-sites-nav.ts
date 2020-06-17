import { Product } from '../types';
import { getJoinableSitesWithRelevanceFromCache } from './joinable-sites';

export const getJoinableSiteNavData = (
  currentUserUuid: string | undefined,
  captureException: (error: Error) => void
) => {
  try {
    if (!currentUserUuid) {
      return [];
    }

    const sites = getJoinableSitesWithRelevanceFromCache(currentUserUuid);
    return sites
      .filter(
        site =>
          // relevance data is not available when there is only one joinable site
          (sites.length === 1 || site.relevance! > 0) &&
          // only joinable site with product(s) will be shown
          site.products.length &&
          // only joinable site with jira will be shown
          site.products.includes(Product.JiraSoftware)
      )
      .map(site => ({
        avatarUrl: site.avatarUrl,
        cloudId: site.cloudId,
        displayName: site.displayName,
        // for now we are supporting jira only
        // once it supports multiple products, source data should come as
        // site.users: { [key: ProductKey]: User[] }
        // instead of having
        // site.products: ProductKey[], site.users: User[]
        users: {
          [Product.JiraSoftware]: site.users || [],
        },
        relevance: site.relevance || 0,
        url: site.url,
      }));
  } catch (e) {
    captureException(e);
    return [];
  }
};
