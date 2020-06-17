import { __assign, __extends } from "tslib";
import React from 'react';
import { layers } from '@atlaskit/theme/constants';
import Portal from '@atlaskit/portal';
import { ModalTransitionConsumer } from './ModalTransition';
import StackConsumer from './StackConsumer';
import Modal from './Modal';
var ModalWrapper = /** @class */ (function (_super) {
    __extends(ModalWrapper, _super);
    function ModalWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onModalClosed = function (onExited) { return function (e) {
            if (onExited) {
                onExited();
            }
            if (_this.props.onCloseComplete) {
                _this.props.onCloseComplete(e);
            }
        }; };
        return _this;
    }
    ModalWrapper.prototype.render = function () {
        var _this = this;
        return (React.createElement(ModalTransitionConsumer, null, function (_a) {
            var isOpen = _a.isOpen, onExited = _a.onExited;
            return (React.createElement(Portal, { zIndex: layers.modal() },
                React.createElement(StackConsumer, { isOpen: isOpen }, function (naturalStackIndex) { return (React.createElement(Modal, __assign({}, _this.props, { isOpen: isOpen, stackIndex: _this.props.stackIndex || naturalStackIndex, onCloseComplete: _this.onModalClosed(onExited) }), _this.props.children)); })));
        }));
    };
    ModalWrapper.defaultProps = {
        autoFocus: true,
        scrollBehavior: 'inside',
        shouldCloseOnEscapePress: true,
        shouldCloseOnOverlayClick: true,
        isChromeless: false,
        width: 'medium',
        isHeadingMultiline: true,
        onClose: function () { },
    };
    return ModalWrapper;
}(React.Component));
export default ModalWrapper;
//# sourceMappingURL=ModalWrapper.js.map