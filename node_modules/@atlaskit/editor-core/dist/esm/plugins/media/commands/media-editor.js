import { __assign } from "tslib";
import { createCommand, getPluginState } from '../pm-plugins/media-editor';
export var openMediaEditor = function (pos, identifier) {
    return createCommand({
        type: 'open',
        identifier: identifier,
        pos: pos,
    });
};
export var closeMediaEditor = function () {
    return createCommand({
        type: 'close',
    });
};
export var setMediaClientConfig = function (mediaClientConfig) {
    return createCommand({
        type: 'setMediaClientConfig',
        mediaClientConfig: mediaClientConfig,
    });
};
export var uploadAnnotation = function (newIdentifier, newDimensions) {
    return createCommand({
        type: 'upload',
        newIdentifier: newIdentifier,
    }, function (tr, state) {
        var editingMedia = getPluginState(state).editor;
        if (!editingMedia) {
            return tr;
        }
        // remap pos across transactions being applied
        var pos = tr.mapping.map(editingMedia.pos);
        // get the old media node to copy attributes; ensure it's still media
        var oldMediaNode = tr.doc.nodeAt(pos);
        var media = state.schema.nodes.media;
        if (!oldMediaNode || oldMediaNode.type !== media) {
            return tr;
        }
        // update attributes
        var attrs = __assign(__assign({}, oldMediaNode.attrs), { 
            // @atlaskit/media-editor always gives id as string (better types would be nice...)
            id: newIdentifier.id, collection: newIdentifier.collectionName || oldMediaNode.attrs.collection, occurrenceKey: newIdentifier.occurrenceKey, width: newDimensions.width, height: newDimensions.height });
        return tr.setNodeMarkup(pos, undefined, attrs);
    });
};
//# sourceMappingURL=media-editor.js.map