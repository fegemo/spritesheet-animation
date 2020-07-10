import { Color } from './color.js';

class Interpolator {
    interpolate(start, end, t) {
        throw new Error('Abstract method of Interpolator called');
    }
}

export class NumberInterpolator extends Interpolator {
    interpolate(start, end, t) {
        return (end - start) * t + start;
    }
}

export class ColorInterpolator extends Interpolator {
    static #numberInterpolator = new NumberInterpolator();
    
    interpolate(start, end, t) {
        return new Color({
            r: Math.round(ColorInterpolator.#numberInterpolator.interpolate(start.r, end.r, t)),
            g: Math.round(ColorInterpolator.#numberInterpolator.interpolate(start.g, end.g, t)),
            b: Math.round(ColorInterpolator.#numberInterpolator.interpolate(start.b, end.b, t))
        });
    }
}
