//#region Constants
export var TABLE_ACTION;
(function (TABLE_ACTION) {
    TABLE_ACTION["DELETED"] = "deleted";
    TABLE_ACTION["CLEARED"] = "cleared";
    TABLE_ACTION["MERGED"] = "merged";
    TABLE_ACTION["SPLIT"] = "split";
    TABLE_ACTION["COLORED"] = "colored";
    TABLE_ACTION["TOGGLED_HEADER_COLUMN"] = "toggledHeaderColumn";
    TABLE_ACTION["TOGGLED_HEADER_ROW"] = "toggledHeaderRow";
    TABLE_ACTION["TOGGLED_NUMBER_COLUMN"] = "toggledNumberColumn";
    TABLE_ACTION["CHANGED_BREAKOUT_MODE"] = "changedBreakoutMode";
    TABLE_ACTION["CUT"] = "cut";
    TABLE_ACTION["COPIED"] = "copied";
    TABLE_ACTION["ADDED_ROW"] = "addedRow";
    TABLE_ACTION["ADDED_COLUMN"] = "addedColumn";
    TABLE_ACTION["DELETED_ROW"] = "deletedRow";
    TABLE_ACTION["DELETED_COLUMN"] = "deletedColumn";
    TABLE_ACTION["SORTED_COLUMN"] = "sortedColumn";
})(TABLE_ACTION || (TABLE_ACTION = {}));
export var TABLE_BREAKOUT;
(function (TABLE_BREAKOUT) {
    TABLE_BREAKOUT["WIDE"] = "wide";
    TABLE_BREAKOUT["FULL_WIDTH"] = "fullWidth";
    TABLE_BREAKOUT["NORMAL"] = "normal";
})(TABLE_BREAKOUT || (TABLE_BREAKOUT = {}));
//# sourceMappingURL=table-events.js.map