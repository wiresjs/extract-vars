"use strict";
class TokenRules {
    constructor(state, rules) {
        this.state = state;
        this.rules = rules;
    }
    verify(token) {
        let verified = true;
        this.rules.forEach(rule => {
            if (rule.belongs(token)) {
                verified = rule.process(this.state, token);
            }
        });
        return verified;
    }
}
exports.TokenRules = TokenRules;
