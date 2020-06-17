import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

export const FadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0.5;
  }
`;

/* remove this disable once https://github.com/YozhikM/stylelint-a11y/issues/38 is addressed */
/* stylelint-disable a11y/media-prefers-reduced-motion */
export const FadingOutCircle = styled.circle<{ delay?: number }>`
  animation-name: ${FadeOut};
  animation-duration: 0.5s;
  animation-delay: ${({ delay = '0' }) => delay}ms;
  animation-direction: alternate;
  animation-timing-function: ease;
  animation-iteration-count: infinite;

  @media screen and (prefers-reduced-motion: reduce) {
    /* https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/ */
    animation-duration: 0.001ms;
    animation-iteration-count: 1;
  }
`;
/* stylelint-enable */
