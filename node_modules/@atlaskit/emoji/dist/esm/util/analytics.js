import { __assign, __values } from "tslib";
import { createAndFireEvent, } from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion, } from '../version.json';
export var createAndFireEventInElementsChannel = createAndFireEvent('fabric-elements');
var createEvent = function (eventType, action, actionSubject, actionSubjectId, attributes) {
    if (attributes === void 0) { attributes = {}; }
    return ({
        eventType: eventType,
        action: action,
        actionSubject: actionSubject,
        actionSubjectId: actionSubjectId,
        attributes: __assign({ packageName: packageName,
            packageVersion: packageVersion }, attributes),
    });
};
var emojiPickerEvent = function (action, attributes, actionSubjectId) {
    if (attributes === void 0) { attributes = {}; }
    return createEvent('ui', action, 'emojiPicker', actionSubjectId, attributes);
};
export var openedPickerEvent = function () { return emojiPickerEvent('opened'); };
export var closedPickerEvent = function (attributes) {
    return emojiPickerEvent('closed', attributes);
};
var skinTones = [
    { id: '-1f3fb', skinToneModifier: 'light' },
    { id: '-1f3fc', skinToneModifier: 'mediumLight' },
    { id: '-1f3fd', skinToneModifier: 'medium' },
    { id: '-1f3fe', skinToneModifier: 'mediumDark' },
    { id: '-1f3ff', skinToneModifier: 'dark' },
];
var getSkinTone = function (emojiId) {
    var e_1, _a;
    if (!emojiId) {
        return {};
    }
    try {
        for (var skinTones_1 = __values(skinTones), skinTones_1_1 = skinTones_1.next(); !skinTones_1_1.done; skinTones_1_1 = skinTones_1.next()) {
            var _b = skinTones_1_1.value, id = _b.id, skinToneModifier = _b.skinToneModifier;
            if (emojiId.indexOf(id) !== -1) {
                return { skinToneModifier: skinToneModifier, baseEmojiId: emojiId.replace(id, '') };
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (skinTones_1_1 && !skinTones_1_1.done && (_a = skinTones_1.return)) _a.call(skinTones_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return {};
};
export var pickerClickedEvent = function (attributes) {
    return emojiPickerEvent('clicked', __assign(__assign({}, getSkinTone(attributes.emojiId)), attributes), 'emoji');
};
export var categoryClickedEvent = function (attributes) {
    return emojiPickerEvent('clicked', attributes, 'category');
};
export var pickerSearchedEvent = function (attributes) { return emojiPickerEvent('searched', attributes, 'query'); };
var skintoneSelectorEvent = function (action, attributes) {
    if (attributes === void 0) { attributes = {}; }
    return createEvent('ui', action, 'emojiSkintoneSelector', undefined, attributes);
};
export var toneSelectedEvent = function (attributes) {
    return skintoneSelectorEvent('clicked', attributes);
};
export var toneSelectorOpenedEvent = function (attributes) { return skintoneSelectorEvent('opened', attributes); };
export var toneSelectorClosedEvent = function () { return skintoneSelectorEvent('cancelled'); };
var emojiUploaderEvent = function (action, actionSubjectId, attributes) { return createEvent('ui', action, 'emojiUploader', actionSubjectId, attributes); };
export var uploadBeginButton = function () {
    return emojiUploaderEvent('clicked', 'addButton');
};
export var uploadConfirmButton = function (attributes) {
    return emojiUploaderEvent('clicked', 'confirmButton', attributes);
};
export var uploadCancelButton = function () {
    return emojiUploaderEvent('clicked', 'cancelButton');
};
export var uploadSucceededEvent = function (attributes) {
    return createEvent('operational', 'finished', 'emojiUploader', undefined, attributes);
};
export var uploadFailedEvent = function (attributes) {
    return createEvent('operational', 'failed', 'emojiUploader', undefined, attributes);
};
export var deleteBeginEvent = function (attributes) {
    return createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiTrigger', attributes);
};
export var deleteConfirmEvent = function (attributes) {
    return createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiConfirm', attributes);
};
export var deleteCancelEvent = function (attributes) {
    return createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiCancel', attributes);
};
export var selectedFileEvent = function () {
    return createEvent('ui', 'clicked', 'emojiUploader', 'selectFile');
};
var extractCommonAttributes = function (query, emojiList) {
    return {
        queryLength: query ? query.length : 0,
        spaceInQuery: query ? query.indexOf(' ') !== -1 : false,
        emojiIds: emojiList
            ? emojiList
                .map(function (emoji) { return emoji.id; })
                .filter(Boolean)
                .slice(0, 20)
            : [],
    };
};
export var typeaheadCancelledEvent = function (duration, query, emojiList) {
    return createEvent('ui', 'cancelled', 'emojiTypeahead', undefined, __assign({ duration: duration }, extractCommonAttributes(query, emojiList)));
};
var getPosition = function (emojiList, selectedEmoji) {
    if (emojiList) {
        var index = emojiList.findIndex(function (emoji) { return emoji.id === selectedEmoji.id; });
        return index === -1 ? undefined : index;
    }
    return;
};
export var typeaheadSelectedEvent = function (pressed, duration, emoji, emojiList, query, exactMatch) {
    return createEvent('ui', pressed ? 'pressed' : 'clicked', 'emojiTypeahead', undefined, __assign(__assign(__assign({ duration: duration, position: getPosition(emojiList, emoji) }, extractCommonAttributes(query, emojiList)), getSkinTone(emoji.id)), { emojiType: emoji.type, exactMatch: exactMatch || false }));
};
export var typeaheadRenderedEvent = function (duration, query, emojiList) {
    return createEvent('operational', 'rendered', 'emojiTypeahead', undefined, __assign({ duration: duration }, extractCommonAttributes(query, emojiList)));
};
//# sourceMappingURL=analytics.js.map