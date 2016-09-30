import { TokenRule } from "./TokenRule";
import { ParserState } from "./../ParserState";
export declare class TokenRules {
    private state;
    private rules;
    constructor(state: ParserState, rules: TokenRule[]);
    verify(token: string): boolean;
}
