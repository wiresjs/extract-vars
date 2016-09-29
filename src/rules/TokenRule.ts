import { ParserState } from "./../ParserState";


/**
 *
 *
 * @export
 * @class TokenRule
 */
export class TokenRule {

    /**
     *
     *
     * @returns {string[]}
     *
     * @memberOf TokenRule
     */
    public getTokens(): string[] {
        return [];
    }
    /**
     *
     *
     * @param {string} token
     * @returns {boolean}
     *
     * @memberOf TokenRule
     */
    public belongs(token: string): boolean {
        let tokens = this.getTokens();
        return tokens.indexOf(token) > -1;
    }
    /**
     *
     *
     * @param {ParserState} state
     * @returns
     *
     * @memberOf TokenRule
     */
    public process(state: ParserState, token: string): boolean {
        return true;
    }
}
