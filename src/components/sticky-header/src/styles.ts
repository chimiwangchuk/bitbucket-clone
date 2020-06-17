import { layers } from '@atlaskit/theme';
import styled from '@emotion/styled';

/*
  z-index is set as such so that the [...] menu in the sticky header
  appears on top of the file header component (@atlassian/bitkit-file).
  Multiples of 10 have been used to allow for some wiggle room for
  future use if we need to tweak the layers. Even though the dropdown
  has a higher z-index than the sticky header, this works because by
  giving the file header `position:sticky`, it resets the stacking
  context, so the menu still goes underneath the sticky header.

  The stacking order is as follows using layers from @atlaskit/theme:

  Dropdown (layer() = z-index: 400
  |
  Sticky Header (navigation()-10 = z-index: 190)
  |
  File Header
    dropdown_closed: navigation()-20 = z-index: 180
    dropdown_open: dropdown_closed + 1 = z-index: 181

  note: Sticky Header and File Header are given a z-index less than that of navigation(),
  so that they go beneath AK Nav & blankets.

  note(2): AK changed the source of truth values for layers.navigation :(
  https://bitbucket.org/atlassian/atlaskit-mk-2/diff/packages/core/theme/src/constants.js?at=master&diff1=19a12541866d6444b97dec408c3c6efd5f5fbc8f&diff2=74e0f5c5708cf6db0daafa5aedf1c25f7f0da1f0
*/
/* remove this disable once https://github.com/YozhikM/stylelint-a11y/issues/38 is addressed */
/* stylelint-disable a11y/media-prefers-reduced-motion */
export const StickyHeaderContent = styled.div<{
  isShown: boolean;
  topOffset: number;
  offset: number;
}>`
  display: ${({ isShown }) => (isShown ? 'block' : 'none')};
  position: fixed;
  top: ${props => props.topOffset}px;
  transition: width 0.2s ease-in-out;
  width: ${({ offset }) => (offset ? `calc(100% - ${offset}px)` : '100%')};
  z-index: ${layers.navigation() - 10};

  @media screen and (prefers-reduced-motion: reduce) {
    /* https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/ */
    transition-duration: 0.001ms;
  }
`;
/* stylelint-enable */
