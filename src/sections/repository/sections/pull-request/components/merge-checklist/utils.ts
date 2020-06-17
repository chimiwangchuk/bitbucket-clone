import { MergeCheck, MergeCheckKey } from 'src/types';

export const MergeCheckKeyPriority = [
  MergeCheckKey.MINIMUM_SUCCESSFUL_BUILDS,
  MergeCheckKey.FAILED_BUILDS,
  MergeCheckKey.RESOLVED_TASKS,
  MergeCheckKey.MINIMUM_APPROVALS,
  MergeCheckKey.MINIMUM_DEFAULT_REVIEWER_APPROVALS,
  MergeCheckKey.PR_DEPS_MERGED,
];

export const mergeChecklistCompare = (a: MergeCheck, b: MergeCheck) => {
  const ai = MergeCheckKeyPriority.indexOf(a.key);
  const bi = MergeCheckKeyPriority.indexOf(b.key);

  if (ai < bi) {
    return -1;
  }

  if (ai > bi) {
    return 1;
  }

  return 0;
};

export const sortMergeChecklist = (
  mergeCheckItems: MergeCheck[]
): MergeCheck[] => {
  const passedMergeCheck: MergeCheck[] = [];
  const notPassedMergeCheck: MergeCheck[] = [];

  for (let i = 0; i < mergeCheckItems.length; i++) {
    if (mergeCheckItems[i].pass) {
      passedMergeCheck.push(mergeCheckItems[i]);
    } else {
      notPassedMergeCheck.push(mergeCheckItems[i]);
    }
  }

  return [
    ...notPassedMergeCheck.sort(mergeChecklistCompare),
    ...passedMergeCheck.sort(mergeChecklistCompare),
  ];
};
