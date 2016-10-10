"use strict";
const ReserverdVariableDefinition_1 = require("./rules/collection/ReserverdVariableDefinition");
const TokenRules_1 = require("./rules/TokenRules");
const ValidCharacter_1 = require("./rules/ValidCharacter");
const ParserState_1 = require("./ParserState");
const States_1 = require("./States");
class Digger {
    constructor() {
        this.variables = [];
        this.state = new ParserState_1.ParserState();
        this.ignoreNext = false;
        this.rules = new TokenRules_1.TokenRules(this.state, [
            new ReserverdVariableDefinition_1.ReserverdVariableDefinition(),
        ]);
        this.state.set(States_1.States.PENDING_FOR_VARIABLE);
    }
    consumeVariable(char) {
        this.latest = this.latest || [];
        this.latest.push(char);
    }
    cancelCurrentVariable() {
        this.latest = null;
        this.state.set(States_1.States.PENDING_FOR_VARIABLE);
        this.state.unset(States_1.States.CONSUMING_VARIABLE);
    }
    cancelLatest() {
        if (!this.state.has(States_1.States.TOKEN_PERSISTED)) {
            this.variables.pop();
        }
    }
    accept(token) {
        return this.rules.verify(token);
    }
    consumeString(char) {
        this.consumingString = char;
    }
    ignoreUntilNot(char) {
        this.ignoredUntilNot = char;
    }
    finalizeVariable() {
        if (this.latest) {
            let tokenName = this.latest.join("");
            this.cancelCurrentVariable();
            if (this.accept(tokenName)) {
                if (!this.state.once(States_1.States.CANCEL_NEXT_TOKEN)) {
                    if (ValidCharacter_1.VariableCharacters.validVariableStart(tokenName[0])) {
                        this.variables.push(tokenName);
                    }
                    this.state.unset(States_1.States.TOKEN_PERSISTED);
                }
            }
        }
    }
    receive(char, end) {
        if (this.ignoreNext) {
            this.ignoreNext = false;
            return;
        }
        if (char === "\\") {
            this.ignoreNext = true;
            return;
        }
        if (this.state.once(States_1.States.EXPECT_ASSIGNING)) {
            if (char !== "=") {
                this.cancelLatest();
                this.state.set(States_1.States.CANCEL_NEXT_TOKEN);
            }
        }
        if (this.state.once(States_1.States.CANCEL_PREV_TOKEN)) {
            this.cancelLatest();
        }
        if (this.ignoredUntilNot) {
            if (this.ignoredUntilNot !== char) {
                delete this.ignoredUntilNot;
            }
            else {
                return;
            }
        }
        if (this.consumingString) {
            if (this.consumingString === char) {
                delete this.consumingString;
            }
            return;
        }
        if (this.state.has(States_1.States.PENDING_FOR_VARIABLE)) {
            if (ValidCharacter_1.VariableCharacters.isValid(char)) {
                this.state.unset(States_1.States.PENDING_FOR_VARIABLE);
                this.state.set(States_1.States.CONSUMING_VARIABLE);
            }
        }
        if (this.state.has(States_1.States.CONSUMING_VARIABLE)) {
            if (!ValidCharacter_1.VariableCharacters.isValid(char)) {
                if (char === "(") {
                    return this.cancelCurrentVariable();
                }
                if (!ValidCharacter_1.VariableCharacters.hasStringQuotes(char)) {
                    this.finalizeVariable();
                }
                else {
                    this.consumeVariable(char);
                }
            }
            else {
                this.consumeVariable(char);
                if (end) {
                    return this.finalizeVariable();
                }
            }
            return;
        }
        if (char === ":") {
            return this.state.set(States_1.States.CANCEL_PREV_TOKEN);
        }
        if (char === "=") {
            this.ignoreUntilNot(char);
            return this.state.set(States_1.States.EXPECT_ASSIGNING);
        }
        if (char === `'` || char === `"` || char === "`") {
            this.state.set(States_1.States.TOKEN_PERSISTED);
            return this.consumeString(char);
        }
    }
    getVariables() {
        return this.variables.filter(varname => {
            let isValid = ValidCharacter_1.VariableCharacters.isValid(varname);
            return isValid;
        });
    }
}
exports.dig = (expression) => {
    let digger = new Digger();
    for (let i = 0; i < expression.length; i++) {
        digger.receive(expression[i], i === expression.length - 1);
    }
    let vars = digger.getVariables();
    return digger.variables;
};
