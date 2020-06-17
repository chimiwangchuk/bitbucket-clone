import { Placement } from '@atlaskit/inline-dialog';

export function translatePosition(position: string): Placement | undefined {
  switch (position) {
    case 'top left':
      return 'top-start';
    case 'top center':
      return 'top';
    case 'top right':
      return 'top-end';
    case 'right top':
      return 'right-start';
    case 'right middle':
      return 'right';
    case 'right bottom':
      return 'right-end';
    case 'bottom left':
      return 'bottom-start';
    case 'bottom center':
      return 'bottom';
    case 'bottom right':
      return 'bottom-end';
    case 'left top':
      return 'left-start';
    case 'left middle':
      return 'left';
    case 'left bottom':
      return 'left-end';
    default:
      return undefined;
  }
}
