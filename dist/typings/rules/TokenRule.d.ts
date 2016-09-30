import { ParserState } from "./../ParserState";
export declare class TokenRule {
    getTokens(): string[];
    belongs(token: string): boolean;
    process(state: ParserState, token: string): boolean;
}
