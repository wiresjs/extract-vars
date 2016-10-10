"use strict";
class TokenRule {
    getTokens() {
        return [];
    }
    belongs(token) {
        let tokens = this.getTokens();
        return tokens.indexOf(token) > -1;
    }
    process(state, token) {
        return true;
    }
}
exports.TokenRule = TokenRule;
