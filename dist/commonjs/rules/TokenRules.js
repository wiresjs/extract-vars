"use strict";
var TokenRules = (function () {
    function TokenRules(state, rules) {
        this.state = state;
        this.rules = rules;
    }
    TokenRules.prototype.verify = function (token) {
        var _this = this;
        var verified = true;
        this.rules.forEach(function (rule) {
            if (rule.belongs(token)) {
                verified = rule.process(_this.state, token);
            }
        });
        return verified;
    };
    return TokenRules;
}());
exports.TokenRules = TokenRules;
