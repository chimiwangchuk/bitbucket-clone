/* eslint-disable no-console */
import { __read, __spread } from "tslib";
export var LOG_LEVEL = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    OFF: 4,
};
var Logger = /** @class */ (function () {
    function Logger(_a) {
        var logLevel = (_a === void 0 ? {} : _a).logLevel;
        this.logLevel = LOG_LEVEL.OFF;
        if (typeof logLevel === 'number') {
            this.setLogLevel(logLevel);
        }
    }
    Logger.prototype.setLogLevel = function (logLevel) {
        if (logLevel >= LOG_LEVEL.DEBUG && logLevel <= LOG_LEVEL.OFF) {
            this.logLevel = +logLevel;
        }
        else {
            this.logLevel = LOG_LEVEL.OFF;
        }
    };
    Logger.prototype.logMessage = function (level, type) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (level >= this.logLevel) {
            console[type].apply(console, __spread(args));
        }
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage.apply(this, __spread([LOG_LEVEL.DEBUG, 'log'], args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage.apply(this, __spread([LOG_LEVEL.INFO, 'info'], args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage.apply(this, __spread([LOG_LEVEL.WARN, 'warn'], args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage.apply(this, __spread([LOG_LEVEL.ERROR, 'error'], args));
    };
    return Logger;
}());
export default Logger;
//# sourceMappingURL=logger.js.map