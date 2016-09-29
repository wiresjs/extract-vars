import { TokenRule } from "../TokenRule";
import { ParserState } from "../../ParserState";
import { States } from "../../States";
/**
 * Reserverd variable names
 */
export class StringDefinitions extends TokenRule {

    public getTokens(): string[] {

        return [`'`, `"`];
    }

    public process(state: ParserState, token: string): boolean {
        state.set(States.CANCEL_NEXT_TOKEN);
        return false;
    }
}
