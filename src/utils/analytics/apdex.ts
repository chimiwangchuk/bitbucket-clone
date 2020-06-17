import * as Sentry from '@sentry/browser';
import { get, set } from 'lodash-es';
import {
  appWasServerSideRendered,
  getInitialOrBucketState,
} from 'src/utils/ssr';
import { ApdexTask } from 'src/types/apdex';
import { analyticsClient } from './client';

type ApdexType = 'transition' | 'initialLoad';

export type ApdexEvent = {
  task: ApdexTask;
  taskId?: string;
  type: ApdexType;
  additionalAttributes?: any;
};

export const DEFAULT_APP_NAME = 'frontbucket';

const standardAdditionalAttributes = () => {
  const state = getInitialOrBucketState();

  return {
    appName: DEFAULT_APP_NAME,
    isHorizontalNavEnabled: get(
      state,
      `global.features['fd-horizontal-nav']`,
      false
    ),
    appWasServerSideRendered: appWasServerSideRendered(),
  };
};

const startApdex = (apdexEventAttributes: ApdexEvent): void => {
  const appNamePath = 'additionalAttributes.appName';

  if (!get(apdexEventAttributes, appNamePath)) {
    set(apdexEventAttributes, appNamePath, DEFAULT_APP_NAME);
  }

  analyticsClient().startApdexEvent(apdexEventAttributes);
};

/**
 * Given a task (apdex event id), check to see if the starting event was started by a SPA
 * transition, otherwise, assume the view was rendered after a full server-rendered page load.
 */
const stopApdex = (eventName: ApdexTask): void => {
  // If getApdexStart() returns undefined, we can assume the start was initialLoad
  const startEvent = analyticsClient().getApdexStart({ task: eventName });
  const startEventType = startEvent ? 'transition' : 'initialLoad';
  try {
    // However, we do not want to fire an Apdex stop event if we got here through the
    // browser back/forward buttons OR if we forgot to correctly instrument an in-SPA link.
    // In order to accurately track Apdex we need to start the timer with the
    // user interaction (e.g. clicking a link)
    if (startEventType === 'initialLoad' && !window.isInitialLoadApdex) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.warn(
          `Did you forget to instrument the Apdex timer start for your SPA transition for ${eventName}?`
        );
      }
      return;
    }
    // After this is called once to time the initialLoad, we'll assume we are navigating around the
    // SPA and we should not have any more "initialLoad" events.
    if (window.isInitialLoadApdex === true) {
      window.isInitialLoadApdex = false;
    }

    analyticsClient().stopApdexEvent({
      task: eventName,
      type: startEventType,
      additionalAttributes: {
        ...standardAdditionalAttributes(),
      },
    });
  } catch (e) {
    Sentry.withScope(scope => {
      // Adding some extra ApdexEvent context for debugging errors.
      scope.setExtra('eventName', eventName);
      scope.setExtra('startEventType', startEventType);
      Sentry.captureException(e);
    });
  }
};

/**
 * Adds a stopTime property to the stopApdex event if this is intended.
 *
 */
const addStopTimeToApdexEventIfRequired = (
  event: ApdexEvent,
  stopTimePerformanceMarkEntryName?: string
) => {
  if (stopTimePerformanceMarkEntryName) {
    const entries = window.performance.getEntriesByName(
      stopTimePerformanceMarkEntryName
    );

    if (entries.length) {
      return { ...event, stopTime: entries[0].startTime };
    }
  }

  return event;
};

const stopApdexWithAdditionalAttributes = (
  eventName: ApdexTask,
  additionalAttributes: object = {},
  stopTimePerformanceMarkEntryName?: string
): void => {
  // If getApdexStart() returns undefined, we can assume the start was initialLoad
  const startEvent = analyticsClient().getApdexStart({ task: eventName });
  const startEventType = startEvent ? 'transition' : 'initialLoad';
  try {
    // However, we do not want to fire an Apdex stop event if we got here through the
    // browser back/forward buttons OR if we forgot to correctly instrument an in-SPA link.
    // In order to accurately track Apdex we need to start the timer with the
    // user interaction (e.g. clicking a link)
    if (startEventType === 'initialLoad' && !window.isInitialLoadApdex) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.warn(
          `Did you forget to instrument the Apdex timer start for your SPA transition for ${eventName}?`
        );
      }
      return;
    }
    // After this is called once to time the initialLoad, we'll assume we are navigating around the
    // SPA and we should not have any more "initialLoad" events.
    if (window.isInitialLoadApdex === true) {
      window.isInitialLoadApdex = false;
    }

    analyticsClient().stopApdexEvent(
      addStopTimeToApdexEventIfRequired(
        {
          task: eventName,
          type: startEventType,
          additionalAttributes: {
            ...additionalAttributes,
            ...standardAdditionalAttributes(),
          },
        },
        stopTimePerformanceMarkEntryName
      )
    );
  } catch (e) {
    Sentry.withScope(scope => {
      // Adding some extra ApdexEvent context for debugging errors.
      scope.setExtra('eventName', eventName);
      scope.setExtra('startEventType', startEventType);
      Sentry.captureException(e);
    });
  }
};

export { startApdex, stopApdex, stopApdexWithAdditionalAttributes };
