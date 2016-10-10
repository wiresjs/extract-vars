"use strict";
const TokenRule_1 = require("../TokenRule");
const States_1 = require("../../States");
class ReserverdVariableDefinition extends TokenRule_1.TokenRule {
    getTokens() {
        return ["let", "var", "const"];
    }
    process(state, token) {
        state.set(States_1.States.TOKEN_PERSISTED);
        state.set(States_1.States.CANCEL_NEXT_TOKEN);
        return false;
    }
}
exports.ReserverdVariableDefinition = ReserverdVariableDefinition;
