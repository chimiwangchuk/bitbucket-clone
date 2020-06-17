import { __assign, __rest } from "tslib";
import { jsx } from '@emotion/core';
function warnIfClash(ours, theirs) {
    var ourKeys = Object.keys(ours);
    var theirKeys = Object.keys(theirs);
    ourKeys.forEach(function (key) {
        if (theirKeys.includes(key)) {
            // eslint-disable-next-line no-console
            console.warn("\n          FieldText:\n          You are attempting to add prop \"" + key + "\" to the input field.\n          It is clashing with one of our supplied props.\n          Please try to control this prop through our public API\n        ");
        }
    });
}
export default function Input(_a) {
    var elemAfterInput = _a.elemAfterInput, elemBeforeInput = _a.elemBeforeInput, isDisabled = _a.isDisabled, isReadOnly = _a.isReadOnly, isRequired = _a.isRequired, onMouseDown = _a.onMouseDown, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onBlur = _a.onBlur, onFocus = _a.onFocus, theme = _a.theme, innerRef = _a.innerRef, testId = _a.testId, theirInputProps = __rest(_a, ["elemAfterInput", "elemBeforeInput", "isDisabled", "isReadOnly", "isRequired", "onMouseDown", "onMouseEnter", "onMouseLeave", "onBlur", "onFocus", "theme", "innerRef", "testId"]);
    var ourInputProps = {
        onFocus: onFocus,
        onBlur: onBlur,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
    };
    // Check for any clashes when in development
    if (process.env.NODE_ENV !== 'production') {
        warnIfClash(ourInputProps, theirInputProps);
    }
    var inputProps = __assign(__assign({}, theirInputProps), ourInputProps);
    var containerProps = {
        onMouseDown: onMouseDown,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
    };
    return (jsx("div", __assign({}, containerProps, { css: theme.container }),
        elemBeforeInput,
        jsx("input", __assign({}, inputProps, { css: theme.input, ref: innerRef, "data-testid": testId })),
        elemAfterInput));
}
//# sourceMappingURL=Input.js.map