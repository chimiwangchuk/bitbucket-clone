import { useRef, useEffect } from 'react';

export function useAutofocus() {
  const ref = useRef<HTMLElement>();
  // after mounting, focus the element
  useEffect(() => ref.current && ref.current.focus(), [ref]);
  return ref;
}
