// eslint-disable-next-line @typescript-eslint/camelcase
import add_hours from 'date-fns/add_hours';
// @ts-ignore TODO: fix noImplicitAny error here
import engine from 'store/src/store-engine';
// @ts-ignore TODO: fix noImplicitAny error here
import localStorage from 'store/storages/localStorage';
// @ts-ignore TODO: fix noImplicitAny error here
import memoryStorage from 'store/storages/memoryStorage';
import { BbEnv, AnalyticsEvent, Product, JoinableSite } from '../types';
import urls from '../urls';
import { getJoinableSites } from './identity-jss-client';

const storages = [localStorage, memoryStorage];

const store = engine.createStore(storages);

const MAX_SITES = 24;
const MAX_TEAMS = 5;
const MAX_COLLABORATORS = 20;
const SITES_RELEVANCE_DATA_STORAGE_KEY = `sites_relevance_data`;

function flatMap<T, U>(array: T[], mapFunc: (x: T) => U[]): U[] {
  return array.reduce(
    (cumulus: U[], next: T) => [...mapFunc(next), ...cumulus],
    [] as U[]
  );
}

const safePromise = <T>(
  promise: Promise<T>,
  captureException: (error: Error) => void,
  defaultResult: T
): Promise<T> => {
  return promise.then(
    result => result,
    (error: Error) => {
      captureException(error);
      return defaultResult;
    }
  );
};

const getRecommendedSitesUrl = (bbEnv: BbEnv) =>
  `${urls.external.apiPrivate(
    bbEnv
  )}/growth/bitbucket-to-jsw/recommended-sites`;

type RelevanceCache = {
  uuid: string;
  expiration: number;
  sites: JoinableSite[];
};

type User = {
  account_id: string;
  type: string;
  display_name: string;
  links: {
    avatar: {
      href: string;
    };
  };
  weight: number;
};

const getSitesRelevanceData = (): RelevanceCache | undefined => {
  return store.get(SITES_RELEVANCE_DATA_STORAGE_KEY);
};

const setSitesRelevanceData = (data: RelevanceCache) => {
  return store.set(SITES_RELEVANCE_DATA_STORAGE_KEY, data);
};

const fetchPullRequestMembers = async (uuid: string): Promise<User[]> => {
  const response = await fetch(
    `/!api/2.0/pullrequests/${uuid}?pagelen=50&fields=values.participants&state=MERGED&state=DECLINED&state=SUPERSEDED&state=OPEN`
  );
  if (!response.ok) {
    throw Error(
      `Pull requests fetch failed with text - ${response.statusText}, status: ${response.status}`
    );
  }
  const body: {
    values: Array<{ participants: Array<{ user: User }> }>;
  } = await response.json();
  if (body.values && Array.isArray(body.values)) {
    return flatMap(body.values, item =>
      item.participants
        .map(p => p.user)
        .filter(u => u && u.type === 'user' && u.account_id)
        .map(a => {
          return { ...a, weight: 5 };
        })
    );
  }
  return [];
};

const fetchTeamMembers = async (
  captureException: (error: Error) => void
): Promise<User[]> => {
  const response = await fetch(`/!api/2.0/teams?role=contributor`);
  if (!response.ok) {
    throw Error(
      `Teams fetch failed with text - ${response.statusText}, status: ${response.status}`
    );
  }
  const body = await response.json();
  if (body.values && Array.isArray(body.values)) {
    const selectedTeams: Array<{ uuid: string }> = body.values.slice(
      0,
      Math.min(body.values.length, MAX_TEAMS)
    );
    const memberGroups: Array<{ values: User[] }> = await Promise.all(
      selectedTeams
        .map(item =>
          fetch(
            `/!api/2.0/teams/${encodeURIComponent(item.uuid)}/members`
          ).then(resp => {
            if (!resp.ok) {
              throw Error(
                `Teams members fetch failed for team - ${item.uuid} with text - ${resp.statusText}, status: ${resp.status}`
              );
            }
            return resp.json();
          })
        )
        .map(p => safePromise(p, captureException, { values: [] }))
    );
    return flatMap(memberGroups, team =>
      team.values
        .filter(u => u.type === 'user' && u.account_id)
        .map(a => {
          return { ...a, weight: 1 };
        })
    );
  }

  return [];
};

const getCollaborators = async (
  uuid: string,
  captureException: (error: Error) => void
): Promise<User[]> => {
  const collaboratorPromises = [
    fetchTeamMembers(captureException),
    fetchPullRequestMembers(uuid),
  ];
  const [teamMembers, pullRequestMembers] = await Promise.all(
    collaboratorPromises.map(p => safePromise(p, captureException, []))
  );
  const collaborators = teamMembers.concat(pullRequestMembers);
  return collaborators;
};

const scoreCollaborators = (collaborators: User[]) => {
  return collaborators
    .filter(user => user.account_id)
    .reduce((acc, user) => {
      // @ts-ignore TODO: fix noImplicitAny error here
      acc[user.account_id] = acc[user.account_id] || 0;
      // @ts-ignore TODO: fix noImplicitAny error here
      acc[user.account_id] += user.weight;
      return acc;
    }, {});
};

const getUsersInSites = async (
  bbEnv: BbEnv,
  collaborators: string[],
  cloudIds: string[]
) => {
  const body = {
    collaborators,
    cloudIds,
  };
  const response = await fetch(getRecommendedSitesUrl(bbEnv), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw Error(
      `Recommended sites fetch failed with text - ${response.statusText}, status: ${response.status}`
    );
  }
  const usersInSites: { [key: string]: string[] } = await response.json();
  return usersInSites;
};

const getRelevanceOfJoinableSites = async (
  bbEnv: BbEnv,
  uuid: string,
  joinableSites: JoinableSite[],
  publishOperationalEvent: (event: AnalyticsEvent) => void,
  captureException: (error: Error) => void
): Promise<JoinableSite[]> => {
  try {
    const collaborators = await getCollaborators(uuid, captureException);
    const collaboratorsById: { [key: string]: User } = collaborators.reduce(
      (acc, cur) => {
        // @ts-ignore TODO: fix noImplicitAny error here
        acc[cur.account_id] = cur;
        return acc;
      },
      {}
    );
    const collaboratorScores = scoreCollaborators(collaborators);
    const sortedCollaborators = Object.values(collaboratorsById).sort(
      (a: User, b: User) =>
        // @ts-ignore TODO: fix noImplicitAny error here
        collaboratorScores[b.account_id] - collaboratorScores[a.account_id]
    );
    const topCollaborators = sortedCollaborators.slice(
      0,
      Math.min(sortedCollaborators.length, MAX_COLLABORATORS)
    );
    const usersInSites: { [key: string]: string[] } = await getUsersInSites(
      bbEnv,
      topCollaborators.map(c => c.account_id),
      joinableSites.map(s => s.cloudId)
    );

    const res: JoinableSite[] = joinableSites.map(js => {
      return {
        ...js,
        relevance: usersInSites[js.cloudId]
          ? usersInSites[js.cloudId].reduce(
              // @ts-ignore TODO: fix noImplicitAny error here
              (acc, userId) => acc + collaboratorScores[userId],
              0
            )
          : 0,
        users: usersInSites[js.cloudId]
          ? usersInSites[js.cloudId]
              .map(userId => {
                return {
                  avatarUrl: collaboratorsById[userId].links.avatar.href,
                  displayName: collaboratorsById[userId].display_name,
                  // @ts-ignore TODO: fix noImplicitAny error here
                  relevance: collaboratorScores[userId],
                };
              })
              .sort((a, b) => b.relevance! - a.relevance!)
          : [],
      };
    });

    // Sort in ascending order according to relevance.
    return res.sort((a, b) => b.relevance! - a.relevance!);
  } catch (e) {
    captureException(e);
    publishOperationalEvent({
      source: 'joinableSitesCalculator',
      action: 'calculated',
      actionSubject: 'experiment',
      actionSubjectId: 'maubucket',
      attributes: {
        failed: true,
        stage: 'CALCULATION',
        error: e.message,
      },
    });

    const res: JoinableSite[] = joinableSites.map(js => {
      return {
        ...js,
        relevance: 0,
        users: [],
      };
    });
    return res;
  }
};

const fetchAndRankJoinableSites = async (
  bbEnv: BbEnv,
  products: Product[],
  uuid: string,
  publishOperationalEvent: (event: AnalyticsEvent) => void,
  captureException: (error: Error) => void
) => {
  try {
    const joinableSitesResult: JoinableSite[] = await getJoinableSites(
      bbEnv,
      products
    );
    let sites: JoinableSite[] = [];
    if (joinableSitesResult.length > 1) {
      sites = await getRelevanceOfJoinableSites(
        bbEnv,
        uuid,
        joinableSitesResult,
        publishOperationalEvent,
        captureException
      );
    } else if (joinableSitesResult.length === 1) {
      // Don't retrieve the relevance for a single site.
      sites = [
        {
          ...joinableSitesResult[0],
          relevance: 0,
        },
      ];
    }

    publishOperationalEvent({
      source: 'joinableSitesCalculator',
      action: 'calculated',
      actionSubject: 'experiment',
      actionSubjectId: 'maubucket',
      attributes: {
        clouds: sites.map(k => {
          return {
            cloudId: k.cloudId,
            relevance: k.relevance,
            product: 'jira-software',
          };
        }),
      },
    });

    sites = sites.slice(0, Math.min(sites.length, MAX_SITES));
    const expiration = add_hours(
      Date.now(),
      24 + Math.floor(23 * Math.random())
    ).valueOf();
    setSitesRelevanceData({
      uuid,
      expiration,
      sites,
    });
    return sites;
  } catch (e) {
    captureException(e);
    publishOperationalEvent({
      source: 'joinableSitesCalculator',
      action: 'calculated',
      actionSubject: 'experiment',
      actionSubjectId: 'maubucket',
      attributes: {
        failed: true,
        stage: 'JOINABLE_SITES_FETCHING_AND_CACHE',
        error: e.message,
      },
    });
    return [];
  }
};

export const getJoinableSitesWithRelevance = (
  bbEnv: BbEnv,
  products: Product[],
  uuid: string,
  publishOperationalEvent: (event: AnalyticsEvent) => void,
  captureException: (error: Error) => void
) => {
  try {
    publishOperationalEvent({
      source: 'joinableSitesCalculator',
      action: 'enrolled',
      actionSubject: 'experiment',
      actionSubjectId: 'maubucket',
    });
    const relevanceFromCache = getSitesRelevanceData();
    if (
      !relevanceFromCache ||
      Date.now() >= relevanceFromCache.expiration ||
      relevanceFromCache.uuid !== uuid
    ) {
      return fetchAndRankJoinableSites(
        bbEnv,
        products,
        uuid,
        publishOperationalEvent,
        captureException
      );
    }
    return Promise.resolve(relevanceFromCache.sites);
  } catch (e) {
    captureException(e);
    return Promise.resolve([]);
  }
};

export const getJoinableSitesWithRelevanceFromCache = (uuid: string) => {
  try {
    const relevanceFromCache = getSitesRelevanceData();
    if (relevanceFromCache && relevanceFromCache.uuid === uuid) {
      return relevanceFromCache.sites;
    }
    return [];
  } catch {
    return [];
  }
};
