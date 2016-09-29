import { TokenRule } from "./TokenRule";
import { ParserState } from "./../ParserState";




/**
 * TokenRules
 */
/**
 *
 *
 * @export
 * @class TokenRules
 */
export class TokenRules {
    /**
     * Creates an instance of TokenRules.
     *
     * @param {ParserState} state
     * @param {TokenRule[]} rules
     *
     * @memberOf TokenRules
     */
    constructor(private state: ParserState, private rules: TokenRule[]) { }
    /**
     *
     *
     * @param {string} token
     *
     * @memberOf TokenRules
     */
    public verify(token: string): boolean {
        let verified = true;
        this.rules.forEach(rule => {
            if (rule.belongs(token)) { verified = rule.process(this.state, token); }
        });
        return verified;
    }
}
