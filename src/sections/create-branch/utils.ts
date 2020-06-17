// @ts-ignore TODO: fix noImplicitAny error here
import { createFilter } from '@atlaskit/select';
import { BRANCH_KIND as MODEL_BRANCH_KIND } from 'src/constants/branching-model';
import store from 'src/utils/store';
import {
  BranchType,
  Ref,
  RefOption,
  RefSelectorGroup,
  Repository,
  SelectOption,
  WorkflowBranches,
} from './types';
import { JIRA_ISSUE_MAPPING_MESSAGE_SHOWN, REF_TYPE } from './constants';

/* eslint-disable no-useless-escape */
// Derived from https://git-scm.com/docs/git-check-ref-format
const ILLEGAL_GIT_REF_CHARACTERS = /[\~\^\:\?\*\[\\]/g;
// Derived from https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
const RESERVED_WINDOWS_CHARACTERS = /[\<\>\"\|\%]/g;
// Incompatible or troublesome file system and shell characters
const INCOMPATIBLE_CHARACTERS = /[\]\;\+\'\’\`\&\(\)\$\!\#\{\}\,\=\@]/g;
/* eslint-enable no-useless-escape */
const ASCII_CONTROL_CHARACTERS = /[\000-\037\177]/g;
const CONSECUTIVE_DOTS = /\.\.+/g;
const TRAILING_DOT = /\.$/g;
const CONSECUTIVE_SLASHES = /\/\/+/g;
const TRAILING_SLASH = /\/$/g;
const LEADING_SLASH = /^\//g;
const CONSECUTIVE_SPACES = /\s+/g;

const BRANCH_TYPES = [REF_TYPE.BRANCH, REF_TYPE.NAMED_BRANCH];

export type LimitedValues<T> = {
  values: T[];
  hasMore: boolean;
};

export const getRepoOwnerAndSlug = (repoFullName = ''): string[] => {
  return repoFullName.split('/', 2);
};

export const getRepoFullName = (repository?: Repository): string => {
  return repository ? `${repository.owner}/${repository.slug}` : '';
};

export const sanitizeBranchName = (name: string): string =>
  name
    .trim()
    .replace(ASCII_CONTROL_CHARACTERS, '')
    .replace(ILLEGAL_GIT_REF_CHARACTERS, '')
    .replace(RESERVED_WINDOWS_CHARACTERS, '')
    .replace(INCOMPATIBLE_CHARACTERS, '')
    .replace(CONSECUTIVE_DOTS, '.')
    .replace(TRAILING_DOT, '')
    .replace(CONSECUTIVE_SLASHES, '/')
    .replace(TRAILING_SLASH, '')
    .replace(LEADING_SLASH, '')
    .replace(CONSECUTIVE_SPACES, '-');

// Avoid creating unexpected directories from the issue summary which is usually a sentence
export const sanitizeIssueSummary = (name: string): string =>
  name.trim().replace('/', '-');

export const generateBranchName = (
  name: string,
  type: BranchType | null | undefined
): string => {
  const cleanedName = sanitizeBranchName(name);
  // We only add the prefix if the user has typed something because a prefix only branch name doesn't make much
  // sense.
  if (cleanedName && type && type.prefix) {
    return sanitizeBranchName(`${type.prefix}${cleanedName}`);
  }
  return cleanedName;
};

export const getRef = (o: {
  name: string;
  type?: string;
  target?: { hash: string };
}) => ({
  type: o.type ? (o.type.toUpperCase() as REF_TYPE) : REF_TYPE.BRANCH,
  name: o.name,
  hash: o.target ? o.target.hash : undefined,
});

export const getRefs = (
  objects: Array<{ name: string; type: string; target: { hash: string } }>
): Ref[] => {
  return objects.map(getRef);
};

// @ts-ignore TODO: fix noImplicitAny error here
const isMainBranchRef = (ref, mainBranch) => {
  return BRANCH_TYPES.includes(ref.type) && ref.name === mainBranch.name;
};

// @ts-ignore TODO: fix noImplicitAny error here
export const moveMainBranchToTop = (refs, mainBranch, isFiltered) => {
  if (!mainBranch) {
    return refs;
  }
  // @ts-ignore TODO: fix noImplicitAny error here
  const mainRef = refs.find(ref => isMainBranchRef(ref, mainBranch));
  if (mainRef) {
    const withoutMainBranch = refs.filter(
      // @ts-ignore TODO: fix noImplicitAny error here
      ref => !isMainBranchRef(ref, mainBranch)
    );
    return [mainRef, ...withoutMainBranch];
  }
  if (isFiltered) {
    return refs;
  }
  return [getRef(mainBranch), ...refs];
};

export const getRefOption = (ref: Ref): RefOption => ({
  label: ref.name,
  value: `${ref.type}:${ref.name}`,
  data: undefined,
  ref,
});

export const generateRefSelectorOptions = (refs: Ref[]): RefSelectorGroup[] => {
  const options: RefSelectorGroup[] = [];

  const branches = refs.filter(ref => BRANCH_TYPES.includes(ref.type));
  const tags = refs.filter(ref => ref.type === REF_TYPE.TAG);

  if (branches.length) {
    options.push({
      label: 'refSelectorLabelBranches',
      value: 'refSelectorLabelBranches',
      data: undefined,
      options: branches.map(ref => getRefOption(ref)),
    });
  }

  if (tags.length) {
    options.push({
      label: 'refSelectorLabelTags',
      value: 'refSelectorLabelTags',
      data: undefined,
      options: tags.map((tag: Ref) => getRefOption(tag)),
    });
  }

  return options;
};

// Compares two refs disregarding their `hash` properties
// to avoid possible inconsistencies, e.g. when they're fetched
// in different requests, and the ref has been updated in between
export const areRefsSame = (ref1: Ref, ref2: Ref): boolean => {
  return ref1.name === ref2.name && ref1.type === ref2.type;
};

export const optionFilter = createFilter({
  // Ignoring accents is pretty expensive, and we strip out non-ASCII anyway
  ignoreAccents: false,
  // Only filter on label (by default it would filter both label and value, but we don't need filtering on values)
  // @ts-ignore TODO: fix noImplicitAny error here
  stringify: option => option.label,
});

export const limit = <T>(
  values: T[],
  maxValues: number,
  predicate?: (value: T) => boolean
): LimitedValues<T> => {
  if (!predicate) {
    return {
      values: values.slice(0, maxValues),
      hasMore: values.length > maxValues,
    };
  }

  const result: T[] = [];
  let hasMore = false;
  for (const value of values) {
    if (predicate(value)) {
      if (result.length < maxValues) {
        result.push(value);
      } else {
        // Once we have enough matching values, we find one more to indicate whether the values are limited or not.
        hasMore = true;
        break;
      }
    }
  }
  return {
    values: result,
    hasMore,
  };
};

export const selectOptionRepository = (
  selectOption: SelectOption
): Repository => {
  const [owner, slug] = selectOption.value.split('/');
  return { owner, slug };
};

export const suggestFromBranch = (
  workflowBranches: WorkflowBranches,
  branchType: BranchType | null | undefined
): Ref | null | undefined => {
  const { development, production, main } = workflowBranches;

  // When branching model has not been fetched yet (or request ended up
  // with an error), we suggest the main branch as the best option
  const defaultSuggestion = development || main;

  const isHotfix = branchType && branchType.kind === MODEL_BRANCH_KIND.HOT_FIX;

  if (isHotfix && production) {
    return production;
  } else {
    return defaultSuggestion;
  }
};

export const getJiraIssueMappingMessageShown = () => {
  return store.get(JIRA_ISSUE_MAPPING_MESSAGE_SHOWN, false);
};

export const setJiraIssueMappingMessageShown = (shown: boolean) => {
  return store.set(JIRA_ISSUE_MAPPING_MESSAGE_SHOWN, shown);
};
