import { __extends } from "tslib";
import { Slice } from 'prosemirror-model';
import { Step, StepResult, StepMap, ReplaceStep } from 'prosemirror-transform';
export var tableSortingStepType = 'atlaskit-table-sorting-ordering';
var TableSortStep = /** @class */ (function (_super) {
    __extends(TableSortStep, _super);
    function TableSortStep(pos, prev, next) {
        var _this = _super.call(this) || this;
        _this.prev = prev;
        _this.next = next;
        _this.pos = pos;
        return _this;
    }
    TableSortStep.prototype.invert = function () {
        return new TableSortStep(this.pos, this.next, this.prev);
    };
    TableSortStep.prototype.apply = function (doc) {
        return StepResult.ok(doc);
    };
    TableSortStep.prototype.map = function () {
        return null;
    };
    TableSortStep.prototype.getMap = function () {
        return new StepMap([0, 0, 0]);
    };
    TableSortStep.prototype.toJSON = function () {
        return {
            stepType: tableSortingStepType,
        };
    };
    TableSortStep.fromJSON = function () {
        return new ReplaceStep(0, 0, Slice.empty);
    };
    return TableSortStep;
}(Step));
export { TableSortStep };
/** Register this step with Prosemirror */
Step.jsonID(tableSortingStepType, TableSortStep);
//# sourceMappingURL=sort-step.js.map