import { EventEmitter2 } from 'eventemitter2';
import { LRUCache } from 'lru-fast';
export var mediaState = {
    streams: new LRUCache(1000),
    stateDeferreds: new Map(),
    eventEmitter: new EventEmitter2(),
};
//# sourceMappingURL=cache.js.map