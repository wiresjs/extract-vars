/**
 * Parser state helpers
 *
 *
 * @export
 * @class ParserState
 */
export class ParserState {
    /**
     * A collection of states
     *
     * @private
     *
     * @memberOf ParserState
     */
    private states = new Set();


    /**
     * Set new state
     *
     *
     * @memberOf ParserState
     */
    public set(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            if (!this.states.has(name)) {
                this.states.add(name)
            }
        }
    }


    /**
     *
     *
     *
     * @memberOf ParserState
     */
    public clean(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            this.states.delete(name);
        }
    }


    /**
     *
     *
     * @param {any} name
     * @returns
     *
     * @memberOf ParserState
     */
    public has(name) {
        return this.states.has(name);
    }


    /**
     *
     *
     * @param {any} name
     * @returns
     *
     * @memberOf ParserState
     */
    public once(name : any) {
        let valid = this.states.has(name);
        if (valid) {
            this.states.delete(name);
        }
        return valid;
    }


    /**
     *
     *
     *
     * @memberOf ParserState
     */
    public unset(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            this.states.delete(name);
        }
    }
}
