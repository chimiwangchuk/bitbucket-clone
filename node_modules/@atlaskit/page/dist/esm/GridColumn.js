var _a;
import { __extends } from "tslib";
import React, { Component } from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import { defaultGridColumns } from './internal/vars';
import GridColumn from './internal/GridColumnElement';
var defaultSpacing = 'cosy';
export default withTheme((_a = /** @class */ (function (_super) {
        __extends(AkGridColumn, _super);
        function AkGridColumn() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getTheme = function (props) { return ({
                columns: props.theme && props.theme.columns
                    ? props.theme.columns
                    : defaultGridColumns,
                spacing: props.theme && props.theme.spacing
                    ? props.theme.spacing
                    : defaultSpacing,
                isNestedGrid: false,
            }); };
            _this.getNestedTheme = function (props) { return ({
                columns: props.medium,
                spacing: props.theme && props.theme.spacing
                    ? props.theme.spacing
                    : defaultSpacing,
                isNestedGrid: true,
            }); };
            return _this;
        }
        AkGridColumn.prototype.render = function () {
            return (React.createElement(ThemeProvider, { theme: this.getTheme(this.props) },
                React.createElement(GridColumn, { medium: this.props.medium },
                    React.createElement(ThemeProvider, { theme: this.getNestedTheme(this.props) },
                        React.createElement("div", null, this.props.children)))));
        };
        return AkGridColumn;
    }(Component)),
    _a.defaultProps = {
        medium: 0,
    },
    _a));
//# sourceMappingURL=GridColumn.js.map