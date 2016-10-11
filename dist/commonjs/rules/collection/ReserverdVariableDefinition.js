"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TokenRule_1 = require("../TokenRule");
var States_1 = require("../../States");
var ReserverdVariableDefinition = (function (_super) {
    __extends(ReserverdVariableDefinition, _super);
    function ReserverdVariableDefinition() {
        _super.apply(this, arguments);
    }
    ReserverdVariableDefinition.prototype.getTokens = function () {
        return ["let", "var", "const"];
    };
    ReserverdVariableDefinition.prototype.process = function (state, token) {
        state.set(States_1.States.TOKEN_PERSISTED);
        state.set(States_1.States.CANCEL_NEXT_TOKEN);
        return false;
    };
    return ReserverdVariableDefinition;
}(TokenRule_1.TokenRule));
exports.ReserverdVariableDefinition = ReserverdVariableDefinition;
