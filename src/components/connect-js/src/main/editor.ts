import { ConnectModuleCredentials, NodeCallback } from '../types';

export interface Source {
  key: string;
  source: string;
  originalSource?: string;
}

export interface Listener {
  key: string;
  event: string;
  listener: (data: any) => any;
}

const sources: Source[] = [];
let listeners: Listener[] = [];

function getKey({ moduleId = '' }: ConnectModuleCredentials): string {
  return moduleId;
}

export function editorSetSource(
  credentials: ConnectModuleCredentials,
  source: string
) {
  const data: Source = {
    key: getKey(credentials),
    source,
  };
  const index = sources.findIndex(s => s.key === data.key);
  if (index > -1) {
    sources.splice(index, 1, {
      ...data,
      originalSource: sources[index].originalSource || sources[index].source,
    });
    return;
  }
  sources.push(data);
}

export function editorGetSource(
  credentials: ConnectModuleCredentials,
  cb: NodeCallback
) {
  const key = getKey(credentials);
  const data = sources.find(s => s.key === key);
  cb(null, data ? data.source : '');
}

export function editorGetOriginalSource(
  credentials: ConnectModuleCredentials,
  cb: NodeCallback
) {
  const key = getKey(credentials);
  const data = sources.find(s => s.key === key);
  cb(null, data ? data.originalSource || data.source : '');
}

export function editorResetSource(
  credentials: ConnectModuleCredentials,
  cb: NodeCallback
) {
  const key = getKey(credentials);
  const data = sources.find(s => s.key === key);
  let source = '';
  if (data) {
    source = data.originalSource || data.source;
    editorSetSource(credentials, source);
  }
  cb(null, source);
}

export function editorRemoveSource(credentials: ConnectModuleCredentials) {
  const key = getKey(credentials);
  const dataIndex = sources.findIndex(s => s.key === key);
  if (dataIndex > -1) {
    sources.splice(dataIndex, 1);
  }
}

export function editorAddListener(
  credentials: ConnectModuleCredentials,
  event: string,
  listener: (data: any) => any
) {
  const key = getKey(credentials);
  listeners.push({ key, event, listener });
}

export function editorRemoveListener(
  credentials: ConnectModuleCredentials,
  event: string
) {
  const key = getKey(credentials);
  listeners = listeners.filter(
    ({ key: k, event: e }) => !(k === key && e === event)
  );
}

export function editorEmit(
  credentials: ConnectModuleCredentials,
  event: string,
  data: any
) {
  const key = getKey(credentials);
  listeners
    .filter(({ key: k, event: e }) => k === key && e === event)
    .forEach(({ listener }) => listener(data));
}
