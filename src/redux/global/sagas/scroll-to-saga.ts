import scrollIntoView, {
  SmoothBehaviorOptions,
} from 'smooth-scroll-into-view-if-needed';
import { call } from 'redux-saga/effects';
import { SCROLL_TO_DURATION } from 'src/constants/permalink-scroll';

// @ts-ignore TODO: fix noImplicitAny error here
export default function* scrollToSaga(action) {
  const { payload } = action;
  const {
    duration = SCROLL_TO_DURATION,
    targetId,
    customBehavior,
    block = 'start',
    inline = 'start',
  } = payload;

  const targetElement = document.getElementById(targetId);

  if (!targetElement) {
    return;
  }

  const options: SmoothBehaviorOptions = {
    behavior: customBehavior || 'smooth',
    block,
    inline,
    duration: customBehavior ? 0 : duration,
  };

  yield call(scrollIntoView, targetElement, options);

  const targetNow = document.getElementById(targetId);
  const targetChanged = targetElement !== targetNow;

  // This helps compensate if intersection observation is used
  if (targetNow && targetChanged) {
    yield call(scrollIntoView, targetNow, {
      behavior: 'instant',
      block,
      inline,
    });
  }
}
