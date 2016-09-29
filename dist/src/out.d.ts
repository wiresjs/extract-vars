declare module "ParserState" {
    export class ParserState {
        private states;
        set(...args: any[]): void;
        clean(...args: any[]): void;
        has(name: any): boolean;
        once(name: any): boolean;
        unset(...args: any[]): void;
    }
}
declare module "rules/TokenRule" {
    import { ParserState } from "ParserState";
    export class TokenRule {
        getTokens(): string[];
        belongs(token: string): boolean;
        process(state: ParserState, token: string): boolean;
    }
}
declare module "States" {
    export enum States {
        PENDING_FOR_VARIABLE = 0,
        READY_FOR_CONSUMING = 1,
        CONSUMING_VARIABLE = 2,
        CANCEL_NEXT_TOKEN = 3,
        CANCEL_PREV_TOKEN = 4,
        TOKEN_PERSISTED = 5,
        STRING_CONSUMING = 6,
        STRING_CONSUMED = 7,
        EXPECT_ASSIGNING = 8,
        VARIABLE_DECLARATION_SET = 9,
    }
}
declare module "rules/collection/ReserverdVariableDefinition" {
    import { TokenRule } from "rules/TokenRule";
    import { ParserState } from "ParserState";
    export class ReserverdVariableDefinition extends TokenRule {
        getTokens(): string[];
        process(state: ParserState, token: string): boolean;
    }
}
declare module "rules/TokenRules" {
    import { TokenRule } from "rules/TokenRule";
    import { ParserState } from "ParserState";
    export class TokenRules {
        private state;
        private rules;
        constructor(state: ParserState, rules: TokenRule[]);
        verify(token: string): boolean;
    }
}
declare module "rules/ValidCharacter" {
    export class VariableCharacters {
        static isValid(char: string): boolean;
        static validVariableStart(char: string): boolean;
        static hasStringQuotes(char: string): boolean;
    }
}
declare module "Digger" {
    export const dig: (expression: string) => string[];
}
declare module "index" {
    export { dig } from "Digger";
}
