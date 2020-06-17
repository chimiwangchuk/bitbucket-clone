import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { debounce } from 'lodash-es';

import { Line } from '@atlassian/bitkit-diff/types';

import { WINDOW_RESIZE_DEBOUNCE_DELAY } from 'src/sections/global/constants';
import * as styles from './styles';
import { ScrollBar } from './components/scroll-bar';
import { getLineGroups, enrichWithConflicts, useScrollbarWidth } from './util';
import { useScrollToChange } from './hooks/use-scroll-to-change';

export type DiffScrollMapProps = {
  lines: Line[];
  isSideBySide?: boolean;
};

export const DiffScrollMap: React.FC<DiffScrollMapProps> = ({
  children,
  lines,
  isSideBySide,
}) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollbarWidth = useScrollbarWidth();
  const contentRef = useRef<HTMLDivElement>(null);
  const lineGroups = useMemo(
    () => (isSideBySide ? getLineGroups(lines) : [enrichWithConflicts(lines)]),
    [lines, isSideBySide]
  );

  const maybeUpdateIsScrollable = useCallback(
    debounce(() => {
      if (contentRef.current) {
        const currentlyScrollable =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        if (currentlyScrollable !== isScrollable) {
          setIsScrollable(currentlyScrollable);
        }
      }
    }, WINDOW_RESIZE_DEBOUNCE_DELAY),
    [isScrollable]
  );

  useEffect(() => {
    maybeUpdateIsScrollable();
    window.addEventListener('resize', maybeUpdateIsScrollable);
    return () => window.removeEventListener('resize', maybeUpdateIsScrollable);
  }, [contentRef, maybeUpdateIsScrollable]);

  useScrollToChange(contentRef, lineGroups[0]);

  return (
    <styles.DiffScrollMap>
      <styles.ScrollContent ref={contentRef}>{children}</styles.ScrollContent>
      {isScrollable && (
        <styles.ScrollBarWrapper scrollbarWidth={scrollbarWidth}>
          {lineGroups.map((current, index) => (
            <ScrollBar key={index} lines={current} />
          ))}
        </styles.ScrollBarWrapper>
      )}
    </styles.DiffScrollMap>
  );
};
