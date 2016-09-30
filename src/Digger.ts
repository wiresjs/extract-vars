import { ReserverdVariableDefinition } from "./rules/collection/ReserverdVariableDefinition";
import { TokenRules } from "./rules/TokenRules";
import { VariableCharacters } from "./rules/ValidCharacter";
import { ParserState } from "./ParserState";
import { States } from "./States";



/**
 *
 *
 * @class Digger
 */
class Digger {
    /**
     *
     *
     * @type {string[]}
     * @memberOf Digger
     */
    public latest: string[];
    /**
     *
     *
     * @type {string[]}
     * @memberOf Digger
     */
    public variables: string[] = [];
    /**
     *
     *
     * @private
     *
     * @memberOf Digger
     */
    private state = new ParserState();
    /**
     *
     *
     * @private
     * @type {string}
     * @memberOf Digger
     */
    private consumingString: string;

    /**
     *
     *
     * @private
     * @type {boolean}
     * @memberOf Digger
     */
    private ignoreNext: boolean = false;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberOf Digger
     */
    private ignoredUntilNot: string;
    /**
     *
     *
     * @private
     *
     * @memberOf Digger
     */
    private rules = new TokenRules(this.state, [
        new ReserverdVariableDefinition(),
    ]);


    /**
     * Creates an instance of Digger.
     *
     *
     * @memberOf Digger
     */
    constructor() {
        this.state.set(States.PENDING_FOR_VARIABLE);
    }

    /**
     *
     *
     * @param {string} char
     *
     * @memberOf Digger
     */
    public consumeVariable(char: string) {
        this.latest = this.latest || [];
        this.latest.push(char);
    }

    /**
     *
     *
     *
     * @memberOf Digger
     */
    public cancelCurrentVariable() {
        this.latest = null;
        this.state.set(States.PENDING_FOR_VARIABLE);
        this.state.unset(States.CONSUMING_VARIABLE);
    }

    /**
     *
     *
     *
     * @memberOf Digger
     */
    public cancelLatest() {
        if (!this.state.has(States.TOKEN_PERSISTED)) {
            this.variables.pop();
        }
    }

    /**
     *
     *
     * @param {string} token
     * @returns {boolean}
     *
     * @memberOf Digger
     */
    public accept(token: string): boolean {
        return this.rules.verify(token);
    }

    /**
     *
     *
     * @param {string} char
     *
     * @memberOf Digger
     */
    public consumeString(char: string) {
        this.consumingString = char;
    }

    /**
     *
     *
     * @param {string} char
     *
     * @memberOf Digger
     */
    public ignoreUntilNot(char: string) {
        this.ignoredUntilNot = char;
    }

    /**
     *
     *
     *
     * @memberOf Digger
     */
    public finalizeVariable() {
        if (this.latest) {
            let tokenName = this.latest.join("");
            this.cancelCurrentVariable();
            if (this.accept(tokenName)) {
                // At this point we need to verifiy if a token needs to be cancelled
                if (!this.state.once(States.CANCEL_NEXT_TOKEN)) {
                    if (VariableCharacters.validVariableStart(tokenName[0])) {
                        this.variables.push(tokenName);
                    }

                    this.state.unset(States.TOKEN_PERSISTED);
                }
            }
        }
    }

    /**
     *
     *
     * @param {string} char
     * @param {boolean} end
     * @returns
     *
     * @memberOf Digger
     */
    public receive(char: string, end: boolean) {
        // If next character requires to be ignored
        if (this.ignoreNext) {
            // reset
            this.ignoreNext = false;
            return;
        }

        // Escaping string
        if (char === "\\") {
            this.ignoreNext = true;
            return;
        }

        // If a previous symbol was "=" -> we would like to cancel previously defined variable
        if (this.state.once(States.EXPECT_ASSIGNING)) {
            if (char !== "=") {
                this.cancelLatest();
                this.state.set(States.CANCEL_NEXT_TOKEN);
            }
        }
        if (this.state.once(States.CANCEL_PREV_TOKEN)) {
            this.cancelLatest();
        }

        if (this.ignoredUntilNot) {
            if (this.ignoredUntilNot !== char) {
                delete this.ignoredUntilNot;
            } else {
                return;
            }
        }
        if (this.consumingString) {
            if (this.consumingString === char) {
                delete this.consumingString;
            }
            return;
        }

        if (this.state.has(States.PENDING_FOR_VARIABLE)) {
            if (VariableCharacters.isValid(char)) {
                this.state.unset(States.PENDING_FOR_VARIABLE);
                this.state.set(States.CONSUMING_VARIABLE);
            }
        }

        // we have valid indications here
        // Gotta keep consuming
        if (this.state.has(States.CONSUMING_VARIABLE)) {
            // Consuming variable but it might end
            if (!VariableCharacters.isValid(char)) {
                if (char === "(") {
                    return this.cancelCurrentVariable();
                }
                if (!VariableCharacters.hasStringQuotes(char)) {
                    this.finalizeVariable();
                } else {
                    this.consumeVariable(char);
                }
            } else {
                this.consumeVariable(char);
                if (end) {
                    return this.finalizeVariable(); // handle the last symbol
                }
            }
            return;
        }

        if (char === ":") {
            return this.state.set(States.CANCEL_PREV_TOKEN);
        }
        if (char === "=") {
            this.ignoreUntilNot(char);
            return this.state.set(States.EXPECT_ASSIGNING);
        }
        // Handle strings
        // We just ignore them
        if (char === `'` || char === `"` || char === "`") {
            this.state.set(States.TOKEN_PERSISTED)
            return this.consumeString(char);
        }
    }

    public getVariables() {
        return this.variables.filter(varname => {
            let isValid = VariableCharacters.isValid(varname);
            return isValid
        });
    }
}

export const dig = (expression: string) => {
    let digger = new Digger();
    for (let i = 0; i < expression.length; i++) {
        digger.receive(expression[i], i === expression.length - 1);
    }
    let vars = digger.getVariables();

    return digger.variables;
};
