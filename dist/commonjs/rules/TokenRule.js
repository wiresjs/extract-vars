"use strict";
var TokenRule = (function () {
    function TokenRule() {
    }
    TokenRule.prototype.getTokens = function () {
        return [];
    };
    TokenRule.prototype.belongs = function (token) {
        var tokens = this.getTokens();
        return tokens.indexOf(token) > -1;
    };
    TokenRule.prototype.process = function (state, token) {
        return true;
    };
    return TokenRule;
}());
exports.TokenRule = TokenRule;
