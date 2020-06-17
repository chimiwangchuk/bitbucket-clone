/*
 * This module provides functions to retrieve which sites and products the
 * user associated with the current Atlassian Account session can join.
 */

import urls from '../../urls';
import {
  BbEnv,
  ApiResponseStatusCode,
  Product,
  JoinableSite,
} from '../../types';

const getJoinableSitesUrl = (bbEnv: BbEnv) =>
  `${urls.external.apiPrivate(bbEnv)}/joinable-sites`;

const fetchJoinableSites = (bbEnv: BbEnv, products: Product[]) => {
  return fetch(getJoinableSitesUrl(bbEnv), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      products,
    }),
  });
};

export const getJoinableSites = async (
  bbEnv: BbEnv,
  products: Product[] = [
    Product.Confluence,
    Product.JiraSoftware,
    Product.JiraServiceDesk,
  ]
): Promise<JoinableSite[]> => {
  const resp = await fetchJoinableSites(bbEnv, products);
  if (resp.status === ApiResponseStatusCode.Success) {
    const {
      joinableSites,
    }: { joinableSites: JoinableSite[] } = await resp.json();
    return joinableSites;
  } else if (
    resp.status === ApiResponseStatusCode.BadRequest ||
    resp.status === ApiResponseStatusCode.Unauthorized
  ) {
    // jss returns 400 for public emails, gracefully handle the error as this is expected here
    // furthermore 401 is received for users that their stargate session is expired/out of sync - gracefulyl handle this as well
    return [];
  } else {
    throw new Error(
      `Joinable Sites fetch failed - ${resp.statusText}, status: ${resp.status}`
    );
  }
};
