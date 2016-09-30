/**
 * Variables
 */
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const VALID_VARIABLE_CHARS = `${alphabet}${alphabet.toUpperCase()}$._[]1234567890`;
const VALID_VARIABLE_START = `${alphabet}${alphabet.toUpperCase()}$_`;
const QUOTES = '`"\'';
/**
 *
 *
 * @export
 * @class VariableCharacters
 */
export class VariableCharacters {
    /**
     *
     *
     * @static
     * @param {string} char
     * @returns
     *
     * @memberOf VariableCharacters
     */
    public static isValid(char: string) {
        return VALID_VARIABLE_CHARS.indexOf(char) > -1;
    };

    /**
     *
     *
     * @static
     * @param {string} char
     * @returns
     *
     * @memberOf VariableCharacters
     */
    public static validVariableStart(char: string) {
        return VALID_VARIABLE_START.indexOf(char) > -1;
    }

    /**
     *
     *
     * @static
     * @param {string} varname
     * @returns
     *
     * @memberOf VariableCharacters
     */
    public static isValidVariable(varname: string) {
        for (let i = 0; i < varname.length; i++) {
            if (VALID_VARIABLE_CHARS.indexOf(varname[i]) < 0) {
                return false;
            }
        }
        return true;
    }

    /**
     *
     *
     * @static
     * @param {string} char
     * @returns
     *
     * @memberOf VariableCharacters
     */
    public static hasStringQuotes(char: string) {
        let chars = [`'`, `"`];
        return chars.indexOf(char) > -1;
    }
}
