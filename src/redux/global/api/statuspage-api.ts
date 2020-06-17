import { get } from 'lodash-es';
import { SiteMessage } from 'src/types/site-message';
import { StatuspageIncident } from 'src/types/statuspage';

const getStatuspageApiHost = (): string => {
  const host: Element | null | undefined = document.head
    ? document.head.querySelector('meta[name=statuspage-api-host]')
    : undefined;
  return host ? (host as HTMLMetaElement).content : '';
};

export const getGenericStatusPageIncident = (
  incidents: StatuspageIncident[]
): SiteMessage => {
  const incident = incidents.shift();
  return {
    id: parseInt(incident!.id, 10),
    title: incident!.name,
    appearance: 'banner',
    // This is hardcoded for now since incident messages can have a varying length.
    text:
      "Bitbucket is experiencing an incident, but we're on it. Check our status page for more details.",
    url: incident!.shortlink,
  };
};

export const getIncidents = async () => {
  // Mock incident data for local testing
  if (process.env.NODE_ENV === 'development') {
    return [];
  }

  const resp = await fetch(
    `${getStatuspageApiHost()}/api/v2/incidents/unresolved.json`
  );

  if (!resp.ok) {
    throw new Error('Failed to fetch Statuspage incidents');
  }
  const json = await resp.json();

  // Pluck out the list of incidents from the API response
  return get(json, 'incidents', []);
};
