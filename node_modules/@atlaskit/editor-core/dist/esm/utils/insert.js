import { isNodeSelection, canInsert, hasParentNodeOfType, } from 'prosemirror-utils';
import { Fragment } from 'prosemirror-model';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { isEmptyParagraph } from './document';
import { GapCursorSelection, Side } from '../plugins/gap-cursor';
export var LookDirection;
(function (LookDirection) {
    LookDirection["Before"] = "before";
    LookDirection["After"] = "after";
})(LookDirection || (LookDirection = {}));
var isLastChild = function ($pos, doc) {
    return doc.resolve($pos.after()).node().lastChild === $pos.node();
};
var isFirstChild = function ($pos, doc) {
    return doc.resolve($pos.before()).node().firstChild === $pos.node();
};
var nodeIsInsideAList = function (tr) {
    var nodes = tr.doc.type.schema.nodes;
    return hasParentNodeOfType([nodes.orderedList, nodes.bulletList])(tr.selection);
};
var insertBeforeOrAfter = function (tr, lookDirection, $parentPos, $proposedPosition, content) {
    /**
     * This block caters for the first item in a parent with the cursor being at the very start
     * or the last item with the cursor being at the very end
     *
     * e.g.
     * ul
     *  li {<>}Scenario one
     *  li
     *  li Scenario two{<>}
     */
    if ((isFirstChild($proposedPosition, tr.doc) &&
        lookDirection === LookDirection.Before) ||
        (isLastChild($proposedPosition, tr.doc) &&
            lookDirection === LookDirection.After)) {
        return tr.insert($parentPos[lookDirection](), content);
    }
    return tr.insert($proposedPosition[lookDirection](), content);
};
// FIXME: A more sustainable and configurable way to choose when to split
var shouldSplit = function (nodeType, schemaNodes) {
    return [
        schemaNodes.bulletList,
        schemaNodes.orderedList,
        schemaNodes.panel,
    ].includes(nodeType);
};
export var safeInsert = function (content, position) { return function (tr) {
    var nodes = tr.doc.type.schema.nodes;
    var whitelist = [nodes.rule, nodes.mediaSingle];
    // fallback if the node to insert is not in the whitelist, or if the insertion should happen within a list.
    if (content instanceof Fragment ||
        !whitelist.includes(content.type) ||
        nodeIsInsideAList(tr)) {
        return null;
    }
    // Check for selection
    if (!tr.selection.empty || isNodeSelection(tr.selection)) {
        // NOT IMPLEMENTED
        return null;
    }
    var $from = tr.selection.$from;
    var $insertPos = position
        ? tr.doc.resolve(position)
        : isNodeSelection(tr.selection)
            ? tr.doc.resolve($from.pos + 1)
            : $from;
    var lookDirection;
    var insertPosEnd = $insertPos.end();
    var insertPosStart = $insertPos.start();
    // When parent node is an empty paragraph,
    // check the empty paragraph is the first or last node of its parent.
    if (isEmptyParagraph($insertPos.parent)) {
        if (isLastChild($insertPos, tr.doc)) {
            lookDirection = LookDirection.After;
        }
        else if (isFirstChild($insertPos, tr.doc)) {
            lookDirection = LookDirection.Before;
        }
    }
    else {
        if ($insertPos.pos === insertPosEnd) {
            lookDirection = LookDirection.After;
        }
        else if ($insertPos.pos === insertPosStart) {
            lookDirection = LookDirection.Before;
        }
    }
    if (!lookDirection) {
        // fallback to consumer for now
        return null;
    }
    // Replace empty paragraph
    if (isEmptyParagraph($insertPos.parent) &&
        canInsert(tr.doc.resolve($insertPos[lookDirection]()), content)) {
        return finaliseInsert(tr.replaceWith($insertPos.before(), $insertPos.after(), content), -1);
    }
    var $proposedPosition = $insertPos;
    while ($proposedPosition.depth > 0) {
        var $parentPos = tr.doc.resolve($proposedPosition[lookDirection]());
        var parentNode = $parentPos.node();
        // Insert at position (before or after target pos)
        if (canInsert($proposedPosition, content)) {
            return finaliseInsert(tr.insert($proposedPosition.pos, content), content.nodeSize);
        }
        // If we can't insert, and we think we should split, we fallback to consumer for now
        if (shouldSplit(parentNode.type, tr.doc.type.schema.nodes)) {
            return finaliseInsert(insertBeforeOrAfter(tr, lookDirection, $parentPos, $proposedPosition, content), content.nodeSize);
        }
        // Can not insert into current parent, step up one parent
        $proposedPosition = $parentPos;
    }
    return finaliseInsert(tr.insert($proposedPosition.pos, content), content.nodeSize);
}; };
var finaliseInsert = function (tr, nodeLength) {
    var lastStep = tr.steps[tr.steps.length - 1];
    if (!(lastStep instanceof ReplaceStep || lastStep instanceof ReplaceAroundStep)) {
        return null;
    }
    // Place gap cursor after the newly inserted node
    // Properties `to` and `slice` are private attributes of ReplaceStep.
    // @ts-ignore
    var gapCursorPos = lastStep.to + lastStep.slice.openStart + nodeLength;
    return tr
        .setSelection(new GapCursorSelection(tr.doc.resolve(gapCursorPos), Side.RIGHT))
        .scrollIntoView();
};
//# sourceMappingURL=insert.js.map