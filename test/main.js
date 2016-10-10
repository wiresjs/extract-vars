const ExtractVars = require("../build/commonjs/index.js");
const should = require("should");
const dig = ExtractVars.dig;
describe("Parser test", () => {
    //"ship.pirate[0].name = 'Störtebeker'  ;foo=22"
    /**/
    it("Should parse statement #1", () => {
        dig("user.name").should.deepEqual(['user.name'])
    });

    it("Should parse statement #2", () => {
        dig("user.name && user.email").should.deepEqual(['user.name', 'user.email'])
    });

    it("Should parse statement #3", () => {
        dig("var a = user.name") //.should.deepEqual(['user.name'])
    });

    it("Should parse statement #4", () => {
        dig("ship.pirate[0].name").should.deepEqual(['ship.pirate[0].name'])
    });


    it("Should parse statement #5", () => {
        dig("user['name']").should.deepEqual(["user['name']"])
    });

    it("Should parse statement #6", () => {
        dig(`   user["name"]  `).should.deepEqual([`user["name"]`])
    });



    it("Should parse statement #7", () => {
        dig(`   user["name"] = 'hello string' `).should.deepEqual([])
    });



    it("Should parse statement #8", () => {
        dig(`   user["name"] == 'hello string' `).should.deepEqual(['user["name"]'])
    });



    it("Should parse statement #9", () => {
        dig(`   user.name = 'hello string'; var a = 1; `).should.deepEqual([])
    });

    it("Should parse statement #10", () => {
        dig(`   user.name == 'hello string';var a = 1 `).should.deepEqual(['user.name'])
    });

    it("Should parse statement #11", () => {
        dig(`   user.getFullName()`).should.deepEqual([])
    });

    it("Should parse statement #12", () => {
        dig(`   user.getFullName(user.name)`).should.deepEqual(["user.name"])
    });

    it("Should parse statement #13", () => {
        dig(`   user.getFullName(user.name, "hello") user.age`).should.deepEqual(["user.name", "user.age"])
    });


    it("Should parse statement #14", () => {
        dig(`user.age && user.getFullName()`).should.deepEqual(["user.age"])
    });

    it("Special case", () => {
        dig(`ship.pirate[0].name == 'Störtebeker'  ; a = user.name`).should.deepEqual(['ship.pirate[0].name'])
    });

    it("Should parse statement #15", () => {
        dig(`{active : user.name === 'hello'}`).should.deepEqual(["user.name"])
    });

    it("Should parse statement #16", () => {
        dig(`{active : user.name === 'hello', disabled : !user.age}`).should.deepEqual(["user.name", "user.age"])
    });

    it("Should parse statement #17", () => {
        dig(`{"active" : user.name === 'hello', "disabled" : !user.age}`).should.deepEqual(["user.name", "user.age"])
    });


    it("Should parse statement #17", () => {
        dig(`{"active" : user.name === 'hello', disabled : !user.age > 18 && user.sex === 1}`)
            .should.deepEqual(["user.name", "user.age", "user.sex"])
    });

    it("Should solve issue #1", () => {
        //console.log(dig(`@name callMe($$name)`));
        //dig(`@name callMe($$name)`).should.deepEqual(["$$name"])
    });

    it("Should escape strings", () => {
        dig(` 'usernam\\'e' foo `).should.deepEqual(["foo"])

    });


})