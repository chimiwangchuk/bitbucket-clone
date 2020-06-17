import { __assign } from "tslib";
import React from 'react';
import { Transition } from 'react-transition-group';
var duration = 500;
var easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint
var verticalOffset = 16;
export var Animation = function (_a) {
    var hasEntered = _a.in, _b = _a.stackIndex, stackIndex = _b === void 0 ? 0 : _b, onExited = _a.onExited, onEntered = _a.onEntered, children = _a.children;
    return (React.createElement(Transition, { in: hasEntered, timeout: { enter: 0, exit: duration }, onExited: onExited, onEntered: onEntered, appear: true }, function (unadjustedStatus) {
        // when we first render, we want to finish the 'entering' state render
        // then jump to the 'entered' state as quick as possible.
        var adjustedStatus = hasEntered && unadjustedStatus === 'exited'
            ? 'entering'
            : unadjustedStatus;
        // Fade styles
        var fadeBaseStyles = {
            transition: "opacity " + duration / 2 + "ms",
            opacity: 1,
        };
        var fadeTransitionStyles = {
            entering: {
                opacity: 0,
            },
            entered: {},
            exiting: {
                opacity: 0,
            },
            exited: {},
        };
        // Slide styles
        var slideBaseStyles = {
            transition: "transform " + duration + "ms " + easing,
            transform: "translate3d(0, " + verticalOffset * 2 + "px, 0)",
        };
        var slideTransitionStyles = {
            entering: {},
            entered: {
                transform: stackIndex > 0
                    ? "translate3d(0, " + stackIndex * (verticalOffset / 2) + "px, 0)"
                    : null,
            },
            exiting: {
                transform: "translate3d(0, -" + verticalOffset * 2 + "px, 0)",
            },
            exited: {},
        };
        return children({
            fade: __assign(__assign({}, fadeBaseStyles), fadeTransitionStyles[adjustedStatus]),
            slide: __assign(__assign({}, slideBaseStyles), slideTransitionStyles[adjustedStatus]),
        });
    }));
};
//# sourceMappingURL=Animation.js.map