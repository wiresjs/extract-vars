/**
 * Variables
 */
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const VALID_VARIABLE_CHARS = `${alphabet}${alphabet.toUpperCase()}$._[]1234567890`;
const VALID_VARIABLE_START = `${alphabet}${alphabet.toUpperCase()}$_`;
export class VariableCharacters {
    public static isValid(char: string) {
        return VALID_VARIABLE_CHARS.indexOf(char) > -1;
    };

    public static validVariableStart(char: string) {
        return VALID_VARIABLE_START.indexOf(char) > -1;
    }

    public static hasStringQuotes(char: string) {
        let chars = [`'`, `"`];
        return chars.indexOf(char) > -1;
    }
}
