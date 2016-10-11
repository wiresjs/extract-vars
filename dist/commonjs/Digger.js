"use strict";
var ReserverdVariableDefinition_1 = require("./rules/collection/ReserverdVariableDefinition");
var TokenRules_1 = require("./rules/TokenRules");
var ValidCharacter_1 = require("./rules/ValidCharacter");
var ParserState_1 = require("./ParserState");
var States_1 = require("./States");
var Digger = (function () {
    function Digger() {
        this.variables = [];
        this.state = new ParserState_1.ParserState();
        this.ignoreNext = false;
        this.rules = new TokenRules_1.TokenRules(this.state, [
            new ReserverdVariableDefinition_1.ReserverdVariableDefinition(),
        ]);
        this.state.set(States_1.States.PENDING_FOR_VARIABLE);
    }
    Digger.prototype.consumeVariable = function (char) {
        this.latest = this.latest || [];
        this.latest.push(char);
    };
    Digger.prototype.cancelCurrentVariable = function () {
        this.latest = null;
        this.state.set(States_1.States.PENDING_FOR_VARIABLE);
        this.state.unset(States_1.States.CONSUMING_VARIABLE);
    };
    Digger.prototype.cancelLatest = function () {
        if (!this.state.has(States_1.States.TOKEN_PERSISTED)) {
            this.variables.pop();
        }
    };
    Digger.prototype.accept = function (token) {
        return this.rules.verify(token);
    };
    Digger.prototype.consumeString = function (char) {
        this.consumingString = char;
    };
    Digger.prototype.ignoreUntilNot = function (char) {
        this.ignoredUntilNot = char;
    };
    Digger.prototype.finalizeVariable = function () {
        if (this.latest) {
            var tokenName = this.latest.join("");
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
    };
    Digger.prototype.receive = function (char, end) {
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
        if (char === "'" || char === "\"" || char === "`") {
            this.state.set(States_1.States.TOKEN_PERSISTED);
            return this.consumeString(char);
        }
    };
    Digger.prototype.getVariables = function () {
        return this.variables.filter(function (varname) {
            var isValid = ValidCharacter_1.VariableCharacters.isValid(varname);
            return isValid;
        });
    };
    return Digger;
}());
exports.dig = function (expression) {
    var digger = new Digger();
    for (var i = 0; i < expression.length; i++) {
        digger.receive(expression[i], i === expression.length - 1);
    }
    var vars = digger.getVariables();
    return digger.variables;
};
