"use strict";
(function (States) {
    States[States["PENDING_FOR_VARIABLE"] = 0] = "PENDING_FOR_VARIABLE";
    States[States["READY_FOR_CONSUMING"] = 1] = "READY_FOR_CONSUMING";
    States[States["CONSUMING_VARIABLE"] = 2] = "CONSUMING_VARIABLE";
    States[States["CANCEL_NEXT_TOKEN"] = 3] = "CANCEL_NEXT_TOKEN";
    States[States["CANCEL_PREV_TOKEN"] = 4] = "CANCEL_PREV_TOKEN";
    States[States["TOKEN_PERSISTED"] = 5] = "TOKEN_PERSISTED";
    States[States["STRING_CONSUMING"] = 6] = "STRING_CONSUMING";
    States[States["STRING_CONSUMED"] = 7] = "STRING_CONSUMED";
    States[States["EXPECT_ASSIGNING"] = 8] = "EXPECT_ASSIGNING";
    States[States["VARIABLE_DECLARATION_SET"] = 9] = "VARIABLE_DECLARATION_SET";
})(exports.States || (exports.States = {}));
var States = exports.States;
