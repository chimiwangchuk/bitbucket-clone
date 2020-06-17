import { mediaState } from '@atlaskit/media-core';
export var globalMediaEventEmitter = {
    on: function (event, listener) {
        if (mediaState.eventEmitter) {
            mediaState.eventEmitter.on(event, listener);
        }
    },
    off: function (event, listener) {
        if (mediaState.eventEmitter) {
            mediaState.eventEmitter.off(event, listener);
        }
    },
    emit: function (event, payload) {
        if (mediaState.eventEmitter) {
            return mediaState.eventEmitter.emit(event, payload);
        }
        return undefined;
    },
};
//# sourceMappingURL=globalMediaEventEmitter.js.map