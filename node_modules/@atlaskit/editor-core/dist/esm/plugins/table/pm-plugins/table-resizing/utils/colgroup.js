import { __read, __spread } from "tslib";
import { DOMSerializer } from 'prosemirror-model';
import { getFragmentBackingArray } from '../../../../../utils/slice';
export var generateColgroup = function (table) {
    var cols = [];
    table.content.firstChild.content.forEach(function (cell) {
        var colspan = cell.attrs.colspan || 1;
        if (Array.isArray(cell.attrs.colwidth)) {
            // We slice here to guard against our colwidth array having more entries
            // Than the we actually span. We'll patch the document at a later point.
            cell.attrs.colwidth.slice(0, colspan).forEach(function (width) {
                cols.push(['col', { style: "width: " + width + "px;" }]);
            });
        }
        else {
            // When we have merged cells on the first row (firstChild),
            // We want to ensure we're creating the appropriate amount of
            // cols the table still has.
            cols.push.apply(cols, __spread(Array.from({ length: colspan }, function (_) { return ['col', {}]; })));
        }
    });
    return cols;
};
export var insertColgroupFromNode = function (tableRef, table) {
    var colgroup = tableRef.querySelector('colgroup');
    if (colgroup) {
        tableRef.removeChild(colgroup);
    }
    colgroup = renderColgroupFromNode(table);
    tableRef.insertBefore(colgroup, tableRef.firstChild);
    return colgroup.children;
};
export var hasTableBeenResized = function (table) {
    return !!getFragmentBackingArray(table.content.firstChild.content).find(function (cell) { return cell.attrs.colwidth; });
};
function renderColgroupFromNode(table) {
    var rendered = DOMSerializer.renderSpec(document, 
    // @ts-ignore
    ['colgroup', {}].concat(generateColgroup(table)));
    return rendered.dom;
}
//# sourceMappingURL=colgroup.js.map