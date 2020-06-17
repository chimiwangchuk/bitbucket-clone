import { __assign, __extends, __read, __spread, __values } from "tslib";
import { Step, StepResult, StepMap, ReplaceStep, } from 'prosemirror-transform';
import { Slice } from 'prosemirror-model';
import { EVENT_TYPE, ACTION, } from './types';
import { fireAnalyticsEvent } from './utils';
export var analyticsStepType = 'atlaskit-analytics';
var actionsToIgnore = [
    ACTION.INVOKED,
    ACTION.OPENED,
];
/** Creates undo event from a normal analytics event */
var createUndoEvent = function (analyticsEvent) {
    return (__assign(__assign({}, analyticsEvent), { payload: {
            action: ACTION.UNDID,
            actionSubject: analyticsEvent.payload.actionSubject,
            actionSubjectId: analyticsEvent.payload.action,
            attributes: __assign(__assign({}, analyticsEvent.payload.attributes), { actionSubjectId: analyticsEvent.payload.actionSubjectId }),
            eventType: EVENT_TYPE.TRACK,
        } }));
};
/** Toggles event action between undo & redo */
var toggleEventAction = function (analyticsEvent) {
    return (__assign(__assign({}, analyticsEvent), { payload: __assign(__assign({}, analyticsEvent.payload), { action: analyticsEvent.payload.action === ACTION.UNDID
                ? ACTION.REDID
                : ACTION.UNDID }) }));
};
/**
 * Custom Prosemirror Step to fire our GAS V3 analytics events
 * Using a Step means that it will work with prosemirror-history and we get
 * undo/redo events for free
 */
var AnalyticsStep = /** @class */ (function (_super) {
    __extends(AnalyticsStep, _super);
    function AnalyticsStep(createAnalyticsEvent, analyticsEvents, pos) {
        var _this = _super.call(this) || this;
        _this.analyticsEvents = [];
        _this.createAnalyticsEvent = createAnalyticsEvent;
        _this.analyticsEvents = analyticsEvents;
        _this.pos = pos;
        return _this;
    }
    /**
     * Generate new undo/redo analytics event when step is inverted
     */
    AnalyticsStep.prototype.invert = function () {
        var analyticsEvents = this.analyticsEvents
            .filter(function (analyticsEvent) {
            return actionsToIgnore.indexOf(analyticsEvent.payload.action) === -1;
        })
            .map(function (analyticsEvent) {
            if (analyticsEvent.payload.action === ACTION.UNDID ||
                analyticsEvent.payload.action === ACTION.REDID) {
                return toggleEventAction(analyticsEvent);
            }
            else {
                return createUndoEvent(analyticsEvent);
            }
        });
        return new AnalyticsStep(this.createAnalyticsEvent, analyticsEvents);
    };
    AnalyticsStep.prototype.apply = function (doc) {
        var e_1, _a;
        try {
            for (var _b = __values(this.analyticsEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                var analyticsEvent = _c.value;
                fireAnalyticsEvent(this.createAnalyticsEvent)(analyticsEvent);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return StepResult.ok(doc);
    };
    AnalyticsStep.prototype.map = function (mapping) {
        var newPos = this.pos;
        if (typeof newPos === 'number') {
            newPos = mapping.map(newPos);
        }
        // Return the same events, this step will never be removed
        return new AnalyticsStep(this.createAnalyticsEvent, this.analyticsEvents, newPos);
    };
    AnalyticsStep.prototype.getMap = function () {
        if (typeof this.pos === 'number') {
            return new StepMap([this.pos, 0, 0]);
        }
        return new StepMap([]);
    };
    AnalyticsStep.prototype.merge = function (other) {
        if (other instanceof AnalyticsStep) {
            var otherAnalyticsEvents = other.analyticsEvents;
            return new AnalyticsStep(this.createAnalyticsEvent, __spread(otherAnalyticsEvents, this.analyticsEvents));
        }
        return null;
    };
    AnalyticsStep.prototype.toJSON = function () {
        return {
            stepType: analyticsStepType,
        };
    };
    AnalyticsStep.fromJSON = function () {
        return new ReplaceStep(0, 0, Slice.empty);
    };
    return AnalyticsStep;
}(Step));
export { AnalyticsStep };
/** Register this step with Prosemirror */
Step.jsonID(analyticsStepType, AnalyticsStep);
//# sourceMappingURL=analytics-step.js.map