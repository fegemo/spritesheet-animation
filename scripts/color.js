export class Color {
    constructor(description) {
        if (typeof description === 'string') {
            description = Color.hexToRgb(description);
        }
        this.r = description.r;
        this.g = description.g;
        this.b = description.b;
    }

    static hexToRgb(hex) {
        const match = hex.replace(/#/, '').match(/.{1,2}/g);
        return {
            r: parseInt(match[0], 16),
            g: parseInt(match[1], 16),
            b: parseInt(match[2], 16)
        };
    }

    asHex() {
        return `#${this.r.toString(16).padStart(2, '0')}${this.g.toString(16).padStart(2, '0')}${this.b.toString(16).padStart(2, '0')}`
    }

    asRgbCss() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    toString() {
        return this.asHex();
    }
}

