import { __assign, __extends, __rest } from "tslib";
import React, { Component } from 'react';
import Modal from '@atlaskit/modal-dialog';
import Button, { Theme as ButtonTheme } from '@atlaskit/button';
import { Actions as ModalActions, ActionItem, Body, Heading, Image, } from '../styled/Modal';
import { modalButtonTheme } from './theme';
function noop() { }
var OnboardingModal = /** @class */ (function (_super) {
    __extends(OnboardingModal, _super);
    function OnboardingModal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headerComponent = function (props) {
            var HeaderElement = props.header, src = props.image;
            var ImageElement = function () { return React.createElement(Image, { alt: "", src: src }); };
            return HeaderElement || ImageElement;
        };
        _this.footerComponent = function (props) {
            var FooterElement = props.footer, actionList = props.actions;
            var ActionsElement = function () {
                return actionList ? (React.createElement(ButtonTheme.Provider, { value: modalButtonTheme },
                    React.createElement(ModalActions, null, actionList.map(function (_a, idx) {
                        var text = _a.text, key = _a.key, rest = __rest(_a, ["text", "key"]);
                        var variant = idx ? 'subtle-link' : 'primary';
                        return (React.createElement(ActionItem, { key: key || (typeof text === 'string' ? text : "" + idx) },
                            React.createElement(Button, __assign({ appearance: variant, autoFocus: !idx }, rest), text)));
                    })))) : null;
            };
            return FooterElement || ActionsElement;
        };
        return _this;
    }
    OnboardingModal.prototype.render = function () {
        var _a = this.props, actions = _a.actions, children = _a.children, heading = _a.heading, props = __rest(_a, ["actions", "children", "heading"]);
        return (React.createElement(Modal, __assign({ autoFocus: true, components: {
                Header: this.headerComponent(this.props),
                Footer: this.footerComponent(this.props),
            }, onClose: noop, scrollBehavior: "outside", shouldCloseOnOverlayClick: false, shouldCloseOnEscapePress: false }, props),
            React.createElement(Body, null,
                heading && React.createElement(Heading, null, heading),
                children)));
    };
    return OnboardingModal;
}(Component));
export default OnboardingModal;
//# sourceMappingURL=Modal.js.map