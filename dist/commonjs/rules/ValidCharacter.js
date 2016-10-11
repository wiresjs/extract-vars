"use strict";
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var VALID_VARIABLE_CHARS = "" + alphabet + alphabet.toUpperCase() + "$._[]1234567890";
var VALID_VARIABLE_START = "" + alphabet + alphabet.toUpperCase() + "$_";
var QUOTES = '`"\'';
var VariableCharacters = (function () {
    function VariableCharacters() {
    }
    VariableCharacters.isValid = function (char) {
        return VALID_VARIABLE_CHARS.indexOf(char) > -1;
    };
    ;
    VariableCharacters.validVariableStart = function (char) {
        return VALID_VARIABLE_START.indexOf(char) > -1;
    };
    VariableCharacters.isValidVariable = function (varname) {
        for (var i = 0; i < varname.length; i++) {
            if (VALID_VARIABLE_CHARS.indexOf(varname[i]) < 0) {
                return false;
            }
        }
        return true;
    };
    VariableCharacters.hasStringQuotes = function (char) {
        var chars = ["'", "\""];
        return chars.indexOf(char) > -1;
    };
    return VariableCharacters;
}());
exports.VariableCharacters = VariableCharacters;
