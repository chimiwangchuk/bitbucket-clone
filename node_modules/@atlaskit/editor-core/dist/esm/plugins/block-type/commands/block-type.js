import { __values } from "tslib";
import { Selection } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';
import { CODE_BLOCK, BLOCK_QUOTE, PANEL, HEADINGS_BY_NAME, NORMAL_TEXT, } from '../types';
import { removeBlockMarks } from '../../../utils/mark';
import { withAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, } from '../../analytics';
import { filterChildrenBetween } from '../../../utils';
import { PANEL_TYPE } from '../../analytics';
export function setBlockType(name) {
    return function (state, dispatch) {
        var nodes = state.schema.nodes;
        if (name === NORMAL_TEXT.name && nodes.paragraph) {
            return setNormalText()(state, dispatch);
        }
        var headingBlockType = HEADINGS_BY_NAME[name];
        if (headingBlockType && nodes.heading && headingBlockType.level) {
            return setHeading(headingBlockType.level)(state, dispatch);
        }
        return false;
    };
}
export function setBlockTypeWithAnalytics(name, inputMethod) {
    return function (state, dispatch) {
        var nodes = state.schema.nodes;
        if (name === NORMAL_TEXT.name && nodes.paragraph) {
            return setNormalTextWithAnalytics(inputMethod)(state, dispatch);
        }
        var headingBlockType = HEADINGS_BY_NAME[name];
        if (headingBlockType && nodes.heading && headingBlockType.level) {
            return setHeadingWithAnalytics(headingBlockType.level, inputMethod)(state, dispatch);
        }
        return false;
    };
}
export function setNormalText() {
    return function (state, dispatch) {
        var tr = state.tr, _a = state.selection, $from = _a.$from, $to = _a.$to, schema = state.schema;
        if (dispatch) {
            dispatch(tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph));
        }
        return true;
    };
}
function withCurrentHeadingLevel(fn) {
    return function (state, dispatch, view) {
        var e_1, _a;
        // Find all headings and paragraphs of text
        var _b = state.schema.nodes, heading = _b.heading, paragraph = _b.paragraph;
        var nodes = filterChildrenBetween(state.doc, state.selection.from, state.selection.to, function (node) {
            return node.type === heading || node.type === paragraph;
        });
        // Check each paragraph and/or heading and check for consistent level
        var level;
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                var nodeLevel = node.node.type === heading ? node.node.attrs.level : 0;
                if (!level) {
                    level = nodeLevel;
                }
                else if (nodeLevel !== level) {
                    // Conflict in level, therefore inconsistent and undefined
                    level = undefined;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return fn(level)(state, dispatch, view);
    };
}
export function setNormalTextWithAnalytics(inputMethod) {
    return withCurrentHeadingLevel(function (previousHeadingLevel) {
        return withAnalytics({
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            eventType: EVENT_TYPE.TRACK,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
            attributes: {
                inputMethod: inputMethod,
                newHeadingLevel: 0,
                previousHeadingLevel: previousHeadingLevel,
            },
        })(setNormalText());
    });
}
export function setHeading(level) {
    return function (state, dispatch) {
        var tr = state.tr, _a = state.selection, $from = _a.$from, $to = _a.$to, schema = state.schema;
        if (dispatch) {
            dispatch(tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, { level: level }));
        }
        return true;
    };
}
export var setHeadingWithAnalytics = function (newHeadingLevel, inputMethod) {
    return withCurrentHeadingLevel(function (previousHeadingLevel) {
        return withAnalytics({
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            eventType: EVENT_TYPE.TRACK,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
            attributes: {
                inputMethod: inputMethod,
                newHeadingLevel: newHeadingLevel,
                previousHeadingLevel: previousHeadingLevel,
            },
        })(setHeading(newHeadingLevel));
    });
};
export function insertBlockType(name) {
    return function (state, dispatch) {
        var nodes = state.schema.nodes;
        switch (name) {
            case BLOCK_QUOTE.name:
                if (nodes.paragraph && nodes.blockquote) {
                    return wrapSelectionIn(nodes.blockquote)(state, dispatch);
                }
                break;
            case CODE_BLOCK.name:
                if (nodes.codeBlock) {
                    return insertCodeBlock()(state, dispatch);
                }
                break;
            case PANEL.name:
                if (nodes.panel && nodes.paragraph) {
                    return wrapSelectionIn(nodes.panel)(state, dispatch);
                }
                break;
        }
        return false;
    };
}
export var insertBlockTypesWithAnalytics = function (name, inputMethod) {
    switch (name) {
        case BLOCK_QUOTE.name:
            return withAnalytics({
                action: ACTION.FORMATTED,
                actionSubject: ACTION_SUBJECT.TEXT,
                eventType: EVENT_TYPE.TRACK,
                actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
                attributes: {
                    inputMethod: inputMethod,
                },
            })(insertBlockType(name));
        case CODE_BLOCK.name:
            return withAnalytics({
                action: ACTION.INSERTED,
                actionSubject: ACTION_SUBJECT.DOCUMENT,
                actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
                attributes: { inputMethod: inputMethod },
                eventType: EVENT_TYPE.TRACK,
            })(insertBlockType(name));
        case PANEL.name:
            return withAnalytics({
                action: ACTION.INSERTED,
                actionSubject: ACTION_SUBJECT.DOCUMENT,
                actionSubjectId: ACTION_SUBJECT_ID.PANEL,
                attributes: {
                    inputMethod: inputMethod,
                    panelType: PANEL_TYPE.INFO,
                },
                eventType: EVENT_TYPE.TRACK,
            })(insertBlockType(name));
        default:
            return insertBlockType(name);
    }
};
/**
 * Function will add wrapping node.
 * 1. If currently selected blocks can be wrapped in the warpper type it will wrap them.
 * 2. If current block can not be wrapped inside wrapping block it will create a new block below selection,
 *  and set selection on it.
 */
function wrapSelectionIn(type) {
    return function (state, dispatch) {
        var tr = state.tr;
        var _a = state.selection, $from = _a.$from, $to = _a.$to;
        var paragraph = state.schema.nodes.paragraph;
        var _b = state.schema.marks, alignment = _b.alignment, indentation = _b.indentation;
        /** Alignment or Indentation is not valid inside block types */
        var removeAlignTr = removeBlockMarks(state, [alignment, indentation]);
        tr = removeAlignTr || tr;
        var range = $from.blockRange($to);
        var wrapping = range && findWrapping(range, type);
        if (range && wrapping) {
            tr.wrap(range, wrapping).scrollIntoView();
        }
        else {
            /** We always want to append a block type */
            tr.replaceRangeWith($to.pos + 1, $to.pos + 1, type.createAndFill({}, paragraph.create()));
            tr.setSelection(Selection.near(tr.doc.resolve(state.selection.to + 1)));
        }
        if (dispatch) {
            dispatch(tr);
        }
        return true;
    };
}
/**
 * Function will insert code block at current selection if block is empty or below current selection and set focus on it.
 */
function insertCodeBlock() {
    return function (state, dispatch) {
        var tr = state.tr;
        var $to = state.selection.$to;
        var codeBlock = state.schema.nodes.codeBlock;
        var getNextNode = state.doc.nodeAt($to.pos + 1);
        var addPos = getNextNode && getNextNode.isText ? 0 : 1;
        /** We always want to append a block type */
        tr.replaceRangeWith($to.pos + addPos, $to.pos + addPos, codeBlock.createAndFill());
        tr.setSelection(Selection.near(tr.doc.resolve(state.selection.to + addPos)));
        if (dispatch) {
            dispatch(tr);
        }
        return true;
    };
}
export var cleanUpAtTheStartOfDocument = function (state, dispatch) {
    var $cursor = state.selection.$cursor;
    if ($cursor &&
        !$cursor.nodeBefore &&
        !$cursor.nodeAfter &&
        $cursor.pos === 1) {
        var tr = state.tr, schema = state.schema;
        var paragraph = schema.nodes.paragraph;
        var parent_1 = $cursor.parent;
        /**
         * Use cases:
         * 1. Change `heading` to `paragraph`
         * 2. Remove block marks
         *
         * NOTE: We already know it's an empty doc so it's safe to use 0
         */
        tr.setNodeMarkup(0, paragraph, parent_1.attrs, []);
        if (dispatch) {
            dispatch(tr);
        }
        return true;
    }
    return false;
};
//# sourceMappingURL=block-type.js.map