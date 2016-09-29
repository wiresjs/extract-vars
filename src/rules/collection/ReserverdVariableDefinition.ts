import { TokenRule } from "../TokenRule";
import { ParserState } from "../../ParserState";
import { States } from "../../States";
/**
 * Reserverd variable names
 */
export class ReserverdVariableDefinition extends TokenRule {

    public getTokens(): string[] {

        return ["let", "var", "const"];
    }

    public process(state: ParserState, token: string): boolean {
        state.set(States.TOKEN_PERSISTED);
        state.set(States.CANCEL_NEXT_TOKEN);
        return false;
    }
}
