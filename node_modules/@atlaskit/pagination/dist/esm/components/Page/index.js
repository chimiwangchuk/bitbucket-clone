import { __assign, __extends } from "tslib";
import React, { Component } from 'react';
import Button from '@atlaskit/button';
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.prototype.render = function () {
        return React.createElement(Button, __assign({}, this.props, { appearance: "subtle" }));
    };
    return Page;
}(Component));
export default Page;
//# sourceMappingURL=index.js.map