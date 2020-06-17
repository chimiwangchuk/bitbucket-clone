import { mergeWith } from 'lodash-es';
import { Repository, Branch, User } from 'src/components/types';
import { Action } from '../types/state';
// TODO: replace these with actual types
// https://softwareteams.atlassian.net/browse/BBCDEV-10777
type Project = object;
type PullRequest = object;

// Don't merge arrays; treat them like other non-object values and override
// @ts-ignore TODO: fix noImplicitAny error here
const mergeArrayStrategy = (existingValue, incomingValue) => {
  if (Array.isArray(existingValue) || Array.isArray(incomingValue)) {
    return incomingValue;
  }

  return undefined;
};

export type EntitiesState = {
  users: { [key: string]: User };
  projects: { [key: string]: Project };
  pullRequests: { [key: string]: PullRequest };
  branches: { [key: string]: Branch };
  repositories: { [key: string]: Repository };
  commits: { [key: string]: object };
  comments: { [key: string]: object };
  tasks: { [key: string]: object };
  commentLikes: { [key: string]: object };
};

type EntityMap = { [key: string]: object };

const initialState: EntitiesState = {
  users: {},
  projects: {},
  pullRequests: {},
  branches: {},
  repositories: {},
  commits: {},
  comments: {},
  tasks: {},
  commentLikes: {},
};

const updateEntitiesWithinMap = (
  currentEntities: EntityMap,
  incomingEntities: EntityMap
) => {
  const startEmpty = {};

  return Object.keys(currentEntities).reduce((combinedMap, entityId) => {
    const currentEntityById = currentEntities[entityId];
    const incomingEntityById = incomingEntities[entityId];

    // @ts-ignore TODO: fix noImplicitAny error here
    combinedMap[entityId] = mergeWith(
      {},
      currentEntityById,
      incomingEntityById,
      mergeArrayStrategy
    );

    return combinedMap;
  }, startEmpty);
};

/**
 * Takes two maps, each being a map of maps of normalized (normalizr) entities,
 * and composes a new map - adding and overwriting any fields found on incoming entities
 * in their place on the current entities while maintaining any values that the incoming
 * entity does not contain or update.
 *
 * @param {{}} currentEntityState
 * @param {{}} incomingEntityState
 * @return {{}} A new entity state object
 */
const mergeAllEntities = (
  currentEntityState: EntitiesState,
  // @ts-ignore TODO: fix noImplicitAny error here
  incomingEntityState
) =>
  Object.keys(currentEntityState).reduce((previousValue, entityType) => {
    // @ts-ignore TODO: fix noImplicitAny error here
    const currentEntitiesByType = currentEntityState[entityType];
    const incomingEntitiesByType = incomingEntityState[entityType] || {};

    const combinedMap = updateEntitiesWithinMap(
      currentEntitiesByType,
      incomingEntitiesByType
    );

    return {
      ...previousValue,
      [entityType]: {
        ...incomingEntitiesByType,
        ...combinedMap,
      },
    };
  }, {});

export default (
  state: EntitiesState = initialState,
  action: Action
): EntitiesState => {
  if (action.payload && action.payload.entities) {
    // TS does not like our merge function
    return mergeAllEntities(state, action.payload.entities) as EntitiesState;
  }

  return state;
};
