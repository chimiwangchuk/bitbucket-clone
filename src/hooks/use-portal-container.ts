import { MutableRefObject, useEffect, useRef } from 'react';

export const usePortalContainer = (initialPortalParentId?: string) => {
  const portalContainerRef: MutableRefObject<HTMLElement | null> = useRef(null);

  function getPortalContainer(): HTMLElement {
    // lazily init the initial ref value (DOM element) to avoid wasted calls to
    // `document.createElement` on every render
    // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
    if (portalContainerRef.current === null) {
      portalContainerRef.current = document.createElement('div');
    }
    return portalContainerRef.current;
  }

  useEffect(() => {
    const parent =
      (initialPortalParentId &&
        document.getElementById(initialPortalParentId)) ||
      document.body;
    parent.appendChild(getPortalContainer());
    return () => {
      getPortalContainer().remove();
    };
    // This is intentionally not meant to change even if initialPortalParentId does
    // (it’s meant to act like a default / initial prop for a component would).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return getPortalContainer();
};
