import { TokenRule } from "../TokenRule";
import { ParserState } from "../../ParserState";
export declare class ReserverdVariableDefinition extends TokenRule {
    getTokens(): string[];
    process(state: ParserState, token: string): boolean;
}
