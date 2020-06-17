import React, { useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash-es';
import { useSelector } from 'react-redux';
import { BucketState } from 'src/types/state';
import { getCombinedBannerAndHorizontalNavHeight } from 'src/selectors/global-selectors';
import { getIsSingleFileModeSettingsHeaderVisible } from 'src/redux/pull-request/selectors';
import { STICKY_HEADER_HEIGHT_OFFSET } from './utils/calculate-header-offset';

type ScrollMonitorOptions = {
  scrollContainer: Window | HTMLElement;
  onScroll: () => void;
  scrollHandlerDelay?: number;
};

const useScrollMonitor = ({
  scrollContainer,
  onScroll,
  scrollHandlerDelay,
}: ScrollMonitorOptions) => {
  const container = scrollContainer || window;
  const delay = scrollHandlerDelay || 1000 / 60;
  const throttledHandler = throttle(onScroll, delay);

  useEffect(() => {
    container.addEventListener('scroll', throttledHandler);
    return () => {
      container.removeEventListener('scroll', throttledHandler);
    };
  });
};

interface HeaderVisibilityProps {
  scrollContainer: Window | HTMLElement;
  dispatchSettingsHeaderVisibilityChanged: (isVisible?: boolean) => void;
}

/**
 * Intersection observer runs the callback func (onChange) async, which means we can't rely on the HTMLElement's top, bottom etc
 * values being consistent for every intersection observed. The threshold set means that after a certain ratio of the target
 * element being intersected, the browser will call your callback, but there's no guarantee at what time your callback will actually run.
 *
 * Using a scroll listener we can avoid this problem as the call back func runs with up-to-date top, bottom etc values (keeping throttle in mind).
 * Intersection observer is useful to determine whether a target element has been intersected by another element, but assume the callback
 * func won't give you the latest position of your elements.
 */
export const withHeaderVisibilityCheck = <T extends {}>(
  Component: React.ComponentType<T>
) => (props: T & HeaderVisibilityProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { dispatchSettingsHeaderVisibilityChanged, scrollContainer } = props;
  const settingsHeaderIsVisible: boolean = useSelector(
    getIsSingleFileModeSettingsHeaderVisible
  );
  const heightOffset = useSelector<BucketState, number>(state =>
    getCombinedBannerAndHorizontalNavHeight(state, false)
  );

  const onScroll = useCallback(() => {
    // sticky header covers the settings header with nav buttons (when in single file mode)
    const boundingRect = ref.current?.getBoundingClientRect();
    const isVisible =
      boundingRect &&
      boundingRect?.top >= heightOffset + STICKY_HEADER_HEIGHT_OFFSET / 2;
    if (isVisible !== settingsHeaderIsVisible) {
      dispatchSettingsHeaderVisibilityChanged(isVisible);
    }
  }, [
    dispatchSettingsHeaderVisibilityChanged,
    heightOffset,
    settingsHeaderIsVisible,
  ]);

  useScrollMonitor({ scrollContainer, onScroll });

  return (
    <div ref={ref}>
      <Component {...props} />
    </div>
  );
};
