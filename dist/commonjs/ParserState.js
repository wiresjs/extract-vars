"use strict";
var ParserState = (function () {
    function ParserState() {
        this.states = new Set();
    }
    ParserState.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < arguments.length; i++) {
            var name_1 = arguments[i];
            if (!this.states.has(name_1)) {
                this.states.add(name_1);
            }
        }
    };
    ParserState.prototype.clean = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < arguments.length; i++) {
            var name_2 = arguments[i];
            this.states.delete(name_2);
        }
    };
    ParserState.prototype.has = function (name) {
        return this.states.has(name);
    };
    ParserState.prototype.once = function (name) {
        var valid = this.states.has(name);
        if (valid) {
            this.states.delete(name);
        }
        return valid;
    };
    ParserState.prototype.unset = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < arguments.length; i++) {
            var name_3 = arguments[i];
            this.states.delete(name_3);
        }
    };
    return ParserState;
}());
exports.ParserState = ParserState;
