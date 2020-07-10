import { Color } from './color.js';

class Formatter {
    format(value) {
        throw new Error('Abstract method called in Formatter');
    }
}

export class DummyFormater extends Formatter {
    format(value) {
        return value;
    }
}

export class NumberFormatter extends Formatter {
    #decimals;
    #roundingFunction;
 
    constructor(decimals = 0, type) {
        super();
        this.#decimals = decimals;
        this.#roundingFunction = type === 'round' ? Math.round : (type === 'floor' ? Math.floor : v => v);
    }

    format(value) {
        if (this.#roundingFunction) {
            value = this.#roundingFunction(value);
        }
        return value.toFixed(this.#decimals);
    }
}

export class ColorFormatter extends Formatter {
    format(value) {
        if (value instanceof Color) {
            return value.asHex();
        }
        return value;
    }
}