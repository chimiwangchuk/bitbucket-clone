import { useEffect, useState, RefObject } from 'react';
import { Line } from '@atlassian/bitkit-diff/types';

export const useScrollToChange = (
  ref: RefObject<HTMLDivElement>,
  lines: Line[]
) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    if (ref.current && !hasScrolled) {
      setHasScrolled(true);
      const index = lines.findIndex(item =>
        ['add', 'del', 'empty'].includes(item.type)
      );

      ref.current.scrollTop =
        index > 2 ? ref.current.scrollHeight * ((index - 1) / lines.length) : 0;
    }
  }, [ref, hasScrolled, lines]);
};
