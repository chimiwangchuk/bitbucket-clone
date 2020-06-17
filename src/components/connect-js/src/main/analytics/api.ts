import { ConnectModuleCredentials } from '../../types';
import { emitter } from './emitter';

export function sendEvent(
  eventType: string,
  credentials: ConnectModuleCredentials
) {
  emitter.emit(eventType, credentials);
}
