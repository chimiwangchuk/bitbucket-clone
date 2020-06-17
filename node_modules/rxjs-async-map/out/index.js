"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
exports.Observable = Observable_1.Observable;
var mergeMap_1 = require("rxjs/operators/mergeMap");
var notify_1 = require("./notify");
var mapper = function (project) {
    var notifiers = new Array();
    var onReady = function () {
        // find the first non-ready notifier in the queue,
        // while invoking all ready notifiers that we encounter along the way
        var notReadyIdx = notifiers.findIndex(function (notifier) { return !notifier.notifyIfReady(); });
        if (notReadyIdx > 0) {
            // remove all the notifiers we invoked
            notifiers.splice(0, notReadyIdx);
        }
    };
    return function (value) { return new Observable_1.Observable(function (sub) {
        notifiers.push(notify_1.notify(project(value), sub, onReady));
    }); };
};
exports.asyncMap = function (project, concurrent) {
    return mergeMap_1.mergeMap(mapper(project), concurrent);
};
//# sourceMappingURL=index.js.map