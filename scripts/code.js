import { NumberFormatter } from "./formatter.js";
import playAudio from "./jukebox.js";

export class Code {
    #source;

    constructor(source = '', triggerEl, executedCb) {
        this.#source = source;
        triggerEl.addEventListener('click', e => {
            let result = this.execute();
            if (!!executedCb) {
                if (typeof result === 'number') {
                    result = new NumberFormatter(2).format(result);
                }
                executedCb(result);
            }
        });

    }
    
    execute() {
        playAudio('whoosh');
        return eval(this.#source);
    }
}

export class MeasuredCode extends Code {

    execute() {
        const timeBefore = performance.now();
        super.execute();
        const ellapsed = performance.now() - timeBefore;

        return ellapsed;
    }
}