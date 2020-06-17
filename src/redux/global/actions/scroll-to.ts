import { SCROLL_TO } from './';

export type ScrollAction = {
  el: HTMLElement;
  top: number;
  left: number;
  // eslint-disable-next-line no-empty-pattern
  forEach: ({}) => void;
};

export type ScrollToPayload = {
  duration?: number;
  targetId: string;
  customBehavior?: string | ((actions: ScrollAction) => void);
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
};

export default function scrollTo(payload: ScrollToPayload) {
  return {
    type: SCROLL_TO,
    payload,
  };
}
