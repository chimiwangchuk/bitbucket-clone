"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = function (promise, observer, onReady) {
    var notifier = {
        notifyIfReady: function () { return false; }
    };
    promise.then(function (value) {
        notifier.notifyIfReady = function () {
            observer.next(value);
            observer.complete();
            return true;
        };
        onReady(notifier);
    }, function (reason) {
        notifier.notifyIfReady = function () {
            observer.error(reason);
            return true;
        };
        onReady(notifier);
    });
    return notifier;
};
//# sourceMappingURL=notify.js.map