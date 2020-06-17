import { ConnectTarget } from '../../types';
import { getObjectValue } from '../../utils';

export function linkerTargetSelfLink(
  target: ConnectTarget,
  principalId = ''
): string {
  if (!target || !principalId) {
    return '';
  }
  const appKey = getObjectValue(target, 'context.key');
  const linkKey = getObjectValue(target, 'module.descriptor.key');
  const text = getObjectValue(target, 'text');
  if (!appKey || !linkKey || !text) {
    return '';
  }
  return `internal_linker_match:${principalId}:${appKey}:${linkKey}:${text}`;
}
