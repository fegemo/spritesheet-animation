export class Observable {
    #value;
    #observers;
    #alwaysNotify;

    constructor(initialValue, alwaysNotify = false) {
        this.#value = initialValue;
        this.#observers = [];
        this.#alwaysNotify = alwaysNotify;
    }

    observe(changedCallback) {
        this.#observers.push(changedCallback);
    }

    get value() {
        return this.#value;
    }

    set value(newValue) {
        if (this.#value !== newValue || this.#alwaysNotify) {
            if (typeof this.#value === 'number') {
                newValue = +newValue;
            }
            this.#observers.forEach(cb => cb(this.#value, newValue));
            this.#value = newValue;
        }
    }
}