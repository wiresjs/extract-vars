(function($__exports__, $isBackend) {var __local__ = {};var define = function(n, d, f) {__local__[n] = { d: d, f: f }};var __resolve__ = function(name) {var m = __local__[name];if (m === undefined) {if ($isBackend) {return require(name);} else {Exports.__npm__ = Exports.__npm__ || {};return Exports.__npm__[name];}}if (m.r) { return m.r; }m.r = {};var z = [__resolve__, m.r];for (var i = 2; i < m.d.length; i++) {z.push(__resolve__(m.d[i]));}m.f.apply(null, z);return m.r;};
define("ParserState", ["require", "exports"], function (require, exports) {
    "use strict";
    class ParserState {
        constructor() {
            this.states = new Set();
        }
        set(...args) {
            for (let i = 0; i < arguments.length; i++) {
                let name = arguments[i];
                if (!this.states.has(name)) {
                    this.states.add(name);
                }
            }
        }
        clean(...args) {
            for (let i = 0; i < arguments.length; i++) {
                let name = arguments[i];
                this.states.delete(name);
            }
        }
        has(name) {
            return this.states.has(name);
        }
        once(name) {
            let valid = this.states.has(name);
            if (valid) {
                this.states.delete(name);
            }
            return valid;
        }
        unset(...args) {
            for (let i = 0; i < arguments.length; i++) {
                let name = arguments[i];
                this.states.delete(name);
            }
        }
    }
    exports.ParserState = ParserState;
});
define("rules/TokenRule", ["require", "exports"], function (require, exports) {
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
});
define("States", ["require", "exports"], function (require, exports) {
    "use strict";
    (function (States) {
        States[States["PENDING_FOR_VARIABLE"] = 0] = "PENDING_FOR_VARIABLE";
        States[States["READY_FOR_CONSUMING"] = 1] = "READY_FOR_CONSUMING";
        States[States["CONSUMING_VARIABLE"] = 2] = "CONSUMING_VARIABLE";
        States[States["CANCEL_NEXT_TOKEN"] = 3] = "CANCEL_NEXT_TOKEN";
        States[States["CANCEL_PREV_TOKEN"] = 4] = "CANCEL_PREV_TOKEN";
        States[States["TOKEN_PERSISTED"] = 5] = "TOKEN_PERSISTED";
        States[States["STRING_CONSUMING"] = 6] = "STRING_CONSUMING";
        States[States["STRING_CONSUMED"] = 7] = "STRING_CONSUMED";
        States[States["EXPECT_ASSIGNING"] = 8] = "EXPECT_ASSIGNING";
        States[States["VARIABLE_DECLARATION_SET"] = 9] = "VARIABLE_DECLARATION_SET";
    })(exports.States || (exports.States = {}));
    var States = exports.States;
});
define("rules/collection/ReserverdVariableDefinition", ["require", "exports", "rules/TokenRule", "States"], function (require, exports, TokenRule_1, States_1) {
    "use strict";
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
});
define("rules/TokenRules", ["require", "exports"], function (require, exports) {
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
});
define("rules/ValidCharacter", ["require", "exports"], function (require, exports) {
    "use strict";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const VALID_VARIABLE_CHARS = `${alphabet}${alphabet.toUpperCase()}$._[]1234567890`;
    const VALID_VARIABLE_START = `${alphabet}${alphabet.toUpperCase()}$_`;
    class VariableCharacters {
        static isValid(char) {
            return VALID_VARIABLE_CHARS.indexOf(char) > -1;
        }
        ;
        static validVariableStart(char) {
            return VALID_VARIABLE_START.indexOf(char) > -1;
        }
        static hasStringQuotes(char) {
            let chars = [`'`, `"`];
            return chars.indexOf(char) > -1;
        }
    }
    exports.VariableCharacters = VariableCharacters;
});
define("Digger", ["require", "exports", "rules/collection/ReserverdVariableDefinition", "rules/TokenRules", "rules/ValidCharacter", "ParserState", "States"], function (require, exports, ReserverdVariableDefinition_1, TokenRules_1, ValidCharacter_1, ParserState_1, States_2) {
    "use strict";
    class Digger {
        constructor() {
            this.variables = [];
            this.state = new ParserState_1.ParserState();
            this.rules = new TokenRules_1.TokenRules(this.state, [
                new ReserverdVariableDefinition_1.ReserverdVariableDefinition(),
            ]);
            this.state.set(States_2.States.PENDING_FOR_VARIABLE);
        }
        consumeVariable(char) {
            this.latest = this.latest || [];
            this.latest.push(char);
        }
        cancelCurrentVariable() {
            this.latest = null;
            this.state.set(States_2.States.PENDING_FOR_VARIABLE);
            this.state.unset(States_2.States.CONSUMING_VARIABLE);
        }
        cancelLatest() {
            if (!this.state.has(States_2.States.TOKEN_PERSISTED)) {
                this.variables.pop();
            }
        }
        accept(token) {
            return this.rules.verify(token);
        }
        ignoreUntil(char) {
            this.ignoredUntil = char;
        }
        ignoreUntilNot(char) {
            this.ignoredUntilNot = char;
        }
        finalizeVariable() {
            if (this.latest) {
                let tokenName = this.latest.join("");
                this.cancelCurrentVariable();
                if (this.accept(tokenName)) {
                    if (!this.state.once(States_2.States.CANCEL_NEXT_TOKEN)) {
                        if (ValidCharacter_1.VariableCharacters.validVariableStart(tokenName[0])) {
                            this.variables.push(tokenName);
                        }
                        this.state.unset(States_2.States.TOKEN_PERSISTED);
                    }
                }
            }
        }
        receive(char, end) {
            if (this.state.once(States_2.States.EXPECT_ASSIGNING)) {
                if (char !== "=") {
                    this.cancelLatest();
                    this.state.set(States_2.States.CANCEL_NEXT_TOKEN);
                }
            }
            if (this.state.once(States_2.States.CANCEL_PREV_TOKEN)) {
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
            if (this.ignoredUntil) {
                if (this.ignoredUntil === char) {
                    delete this.ignoredUntil;
                }
                return;
            }
            if (this.state.has(States_2.States.PENDING_FOR_VARIABLE)) {
                if (ValidCharacter_1.VariableCharacters.isValid(char)) {
                    this.state.unset(States_2.States.PENDING_FOR_VARIABLE);
                    this.state.set(States_2.States.CONSUMING_VARIABLE);
                }
            }
            if (this.state.has(States_2.States.CONSUMING_VARIABLE)) {
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
                return this.state.set(States_2.States.CANCEL_PREV_TOKEN);
            }
            if (char === "=") {
                this.ignoreUntilNot(char);
                return this.state.set(States_2.States.EXPECT_ASSIGNING);
            }
            if (char === `'` || char === `"`) {
                this.state.set(States_2.States.TOKEN_PERSISTED);
                return this.ignoreUntil(char);
            }
        }
    }
    exports.dig = (expression) => {
        let digger = new Digger();
        for (let i = 0; i < expression.length; i++) {
            digger.receive(expression[i], i === expression.length - 1);
        }
        return digger.variables;
    };
});
define("index", ["require", "exports", "Digger"], function (require, exports, Digger_1) {
    "use strict";
    exports.dig = Digger_1.dig;
});

var __expose__ = function(n, m, w, c) {
    var e = __resolve__(n);
    var bc;
    if (!$isBackend) { var npm = $__exports__.__npm__ = $__exports__.__npm__ || {}; if (m) { bc = npm[m] } }
    var cs = c ? c.split(",") : [];
    if (cs.length){ for (var ln in __local__) { for (var i = 0; i < cs.length; i++) { if (ln.indexOf(cs[i]) === 0) { __resolve__(ln) } } }}
    for (var k in e) {
        $isBackend || w ? $__exports__[k] = e[k] : null;
        bc ? bc[e] = e[k] : null;
    }
};
__expose__("index", "extract-vars", true, "");
})(typeof exports !== "undefined" ? exports : this, typeof exports !== "undefined");