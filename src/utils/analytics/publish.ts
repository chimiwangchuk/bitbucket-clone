import { partition } from 'lodash-es';
import Fact, { AnalyticsEvent } from '@atlassian/bitkit-analytics';
import authRequest from 'src/utils/fetch';
import { captureExceptionWithTags } from 'src/utils/sentry';
import { analyticsClient } from './client';
import urls from './urls';

type StoredEvents = { [eventId: string]: AnalyticsEvent<any> };

type BaseEvent = {
  attributes?: object;
  containerType?: string;
  containerId?: string | number;
  objectType?: string;
  objectId?: string | number;
  tags?: string[];
};

type Event = {
  action: string;
  actionSubject: string;
  actionSubjectId: string | number;
  source: string;
} & BaseEvent;

export type TrackEvent = Event;
export type UiEvent = Event;
export type OperationalEvent = Event;

export type ScreenEvent = {
  name: string;
} & BaseEvent;

// Utility type for creating similar UI events.
// Useful for filters where the events generally
// share multiple properties.
export type FilterEventMap<T> = {
  [K in keyof T]: (value?: T[keyof T]) => Event;
};

const BATCH_PUBLISH_INTERVAL_MILLIS = 5000;
const MAX_BATCH_PUBLISH_INTERVAL_MILLIS = 1000 * 60 * 5;
const STORAGE_KEY = 'bitbucket-analytics';

function pollWithBackoffOnFailure(fn: () => Promise<any>, interval: number) {
  const onSuccess = () =>
    pollWithBackoffOnFailure(fn, BATCH_PUBLISH_INTERVAL_MILLIS);
  const onError = () =>
    pollWithBackoffOnFailure(
      fn,
      Math.min(MAX_BATCH_PUBLISH_INTERVAL_MILLIS, interval * 2)
    );
  setTimeout(() => fn().then(onSuccess, onError), interval);
}

function generateEventId(): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000 + 1);
  return `${timestamp}_${random}`;
}

function prepareEventData(events: Array<AnalyticsEvent<any>>): object[] {
  const currentTime = new Date().getTime();
  return events.map(ev => ({
    name: ev.name,
    properties: ev.properties,
    referrer: ev.referrer,
    timeDelta: ev.time - currentTime,
  }));
}

function getStoredEvents(): StoredEvents {
  try {
    const events = sessionStorage && sessionStorage.getItem(STORAGE_KEY);
    return events ? JSON.parse(events) : {};
  } catch (error) {
    // likely to be a security error thrown when trying to access sessionStorage (BBCDEV-3311)
    // if this fails it's not a big deal, so let's just carry on
    return {};
  }
}

function setStoredEvents(events: StoredEvents): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // Error setting item in session storage
  }
}

function storeEvent(event: AnalyticsEvent<any>): void {
  const eventsDict: StoredEvents = getStoredEvents();
  eventsDict[generateEventId()] = event;
  setStoredEvents(eventsDict);
}

function publishEvents(): Promise<any> {
  const eventsDict = getStoredEvents();
  if (Object.keys(eventsDict).length > 0) {
    setStoredEvents({}); // flush the storage

    // @ts-ignore TODO: fix noImplicitAny error here
    const errorHandler = (e: Error | undefined, events) => () => {
      // We only care about capturing exceptions, not Promise rejections due to non-2XX responses
      if (e) {
        captureExceptionWithTags(e, { component: 'analytics' });
      }
      events.forEach(storeEvent);
      return Promise.reject();
    };

    const [facts, legacy] = partition(eventsDict, 'isFact');

    const publishFacts = facts.length
      ? fetch(
          authRequest(urls.api.internal.events(), {
            method: 'POST',
            body: JSON.stringify({ events: prepareEventData(facts) }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        )
          .then(response =>
            response.ok ? Promise.resolve() : Promise.reject()
          )
          .catch((e: Error | undefined) => errorHandler(e, facts))
      : Promise.resolve();

    const publishLegacy = legacy.length
      ? fetch(
          authRequest(urls.xhr.legacyEvents(), {
            method: 'POST',
            body: JSON.stringify({ events: prepareEventData(legacy) }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        )
          .then(response =>
            response.ok ? Promise.resolve() : Promise.reject()
          )
          .catch((e: Error | undefined) => errorHandler(e, legacy))
      : Promise.resolve();

    return Promise.all([publishFacts, publishLegacy]);
  }

  return Promise.resolve();
}

const publishLegacyEvent = (
  name: string,
  properties: object | null | undefined
): void => {
  const event = { isFact: false, name, properties, time: new Date().getTime() };
  storeEvent(event);
};

const publishFact = (fact: Fact<any>) => {
  storeEvent(fact.generateEvent());
};

const hydrateAnalyticsEventAttributes = (attributes?: object | null) => ({
  ...attributes,
  frontbucketView: true,
});

/** Screen Events: when a user looks at a screen */
const publishScreenEvent = (event: string, attributes?: object | null) => {
  try {
    analyticsClient().sendScreenEvent({
      name: event,
      attributes: hydrateAnalyticsEventAttributes(attributes),
    });
  } catch (e) {
    // Log exception to Sentry and continue execution.
    captureExceptionWithTags(e, { component: 'analytics' });
  }
};

/** Full Screen Events: adds additional context to ScreenEvents */
const publishFullScreenEvent = (event: ScreenEvent) => {
  try {
    analyticsClient().sendScreenEvent({
      ...event,
      attributes: hydrateAnalyticsEventAttributes(event.attributes),
    });
  } catch (e) {
    // Log exception to Sentry and continue execution.
    captureExceptionWithTags(e, { component: 'analytics' });
  }
};

/** Track Events: when a user performs a product action (created issue, deleted project) */
const publishTrackEvent = (event: TrackEvent) => {
  try {
    analyticsClient().sendTrackEvent({
      ...event,
      attributes: hydrateAnalyticsEventAttributes(event.attributes),
    });
  } catch (e) {
    // Log exception to Sentry and continue execution.
    captureExceptionWithTags(e, { component: 'analytics' });
  }
};

/** UI Events: when a user interacts with the UI (clicks a button, selects an option in a dropdown) */
const publishUiEvent = (event: UiEvent) => {
  try {
    analyticsClient().sendUIEvent({
      ...event,
      attributes: hydrateAnalyticsEventAttributes(event.attributes),
    });
  } catch (e) {
    // Log exception to Sentry and continue execution.
    captureExceptionWithTags(e, { component: 'analytics' });
  }
};

const publishOperationalEvent = (event: OperationalEvent) => {
  try {
    analyticsClient().sendOperationalEvent({
      ...event,
      attributes: hydrateAnalyticsEventAttributes(event.attributes),
    });
  } catch (e) {
    // Log exception to Sentry and continue execution.
    captureExceptionWithTags(e, { component: 'analytics' });
  }
};

export {
  publishLegacyEvent,
  publishFact,
  publishScreenEvent,
  publishFullScreenEvent,
  publishTrackEvent,
  publishUiEvent,
  publishOperationalEvent,
};

pollWithBackoffOnFailure(publishEvents, BATCH_PUBLISH_INTERVAL_MILLIS);
