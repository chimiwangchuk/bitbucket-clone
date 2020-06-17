import { useEffect, useState } from 'react';
import { flow } from 'lodash-es';
import { splitChanges } from '@atlassian/bitkit-diff/util/group-chunk';
import { getConflictsChecker } from '@atlassian/bitkit-diff/util/conflicts-checker';
import { Line } from '@atlassian/bitkit-diff/types';

export const enrichWithConflicts = (lines: Line[]): Line[] => {
  const checker = getConflictsChecker();
  return lines.map(checker);
};

export const getLineGroups = (lines: Line[]) => {
  const { before, after } = flow(enrichWithConflicts, splitChanges)(lines);
  return [before, after];
};

export const useScrollbarWidth = () => {
  // in OSX the scrollbar can't always be detected but will be 15px
  // so lets fallback to that value here
  const [width, setWidth] = useState<number>(15);

  useEffect(() => {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode?.removeChild(outer);
    if (scrollbarWidth && width !== scrollbarWidth) {
      setWidth(scrollbarWidth);
    }
  }, [width]);
  return width;
};
