"use strict";
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const VALID_VARIABLE_CHARS = `${alphabet}${alphabet.toUpperCase()}$._[]1234567890`;
const VALID_VARIABLE_START = `${alphabet}${alphabet.toUpperCase()}$_`;
const QUOTES = '`"\'';
class VariableCharacters {
    static isValid(char) {
        return VALID_VARIABLE_CHARS.indexOf(char) > -1;
    }
    ;
    static validVariableStart(char) {
        return VALID_VARIABLE_START.indexOf(char) > -1;
    }
    static isValidVariable(varname) {
        for (let i = 0; i < varname.length; i++) {
            if (VALID_VARIABLE_CHARS.indexOf(varname[i]) < 0) {
                return false;
            }
        }
        return true;
    }
    static hasStringQuotes(char) {
        let chars = [`'`, `"`];
        return chars.indexOf(char) > -1;
    }
}
exports.VariableCharacters = VariableCharacters;
