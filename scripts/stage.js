import { Observable } from './observable.js'
import { NumberFormatter, DummyFormater, ColorFormatter } from './formatter.js';
import { ColorInterpolator, NumberInterpolator } from './interpolator.js';
import { Color } from './color.js';

class Actor {

    constructor({props, bindings}) {
        Object.keys(props).forEach(p => this[p] = props[p]);
        bindings.forEach(b => {
            this[b.property] = b.observable.value;
            b.observable.observe((old, curr) => {
                this[b.property] = curr;
            })
        });
    }

    render(ctx) {
        this.configure(ctx);
        this.draw(ctx);
        this.deconfigure(ctx);
    }

    configure(ctx) {
        ctx.save();
    }

    deconfigure(ctx) {
        ctx.restore();
    }

    update() {

    }
}

class ShapeActor extends Actor {
    constructor({ type, props, bindings }) {
        super({props, bindings});
        this.type = type;
        switch (type) {
            case 'stroke-rectangle':
                this.draw = ctx => ctx.strokeRect(this.x, this.y, this.size, this.size);
                break;

            case 'fill-rectangle':
                this.draw = ctx => ctx.fillRect(this.x, this.y, this.size, this.size);
                break;

            case 'stroke-circle':
                this.draw = ctx => {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.stroke();
                }
                break;

            case 'fill-circle':
                this.draw = ctx => {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
        }
    }

    configure(ctx) {
        super.configure(ctx);
        switch (this.type) {
            case 'stroke-rectangle':
            case 'stroke-circle':
                ctx.strokeStyle = this.color;
            break;

            case 'fill-rectangle':
            case 'fill-circle':
                ctx.fillStyle = this.color;
                break;
        }
    }
}

class ImageActor extends Actor {
    constructor({ type, props, bindings }) {
        super({ props, bindings });
        this.type = type;
        this.width = props.width || null;
        this.height = props.height || null;
        this.frameX = props.frameX || 0;
        this.frameY = props.frameY || 0;
        this.frameWidth = props.frameWidth || this.width;
        this.frameHeight = props.frameHeight || this.height;
        this.image = new Image();
        this.image.src = props.src;
        this.image.onload = () => this.loaded = true;
    }

    draw(ctx) {
        switch (this.type) {
            case 'single-image':
                if (this.loaded) {
                    if (this.width && this.height) {
                        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                    } else {
                        ctx.drawImage(this.image, this.x, this.y);
                    }
                }
                break;
            case 'sheet-image':
                if (this.loaded) {
                    const frame = this.currentFrame;
                    ctx.drawImage(this.image, frame.x, frame.y, frame.width, frame.height, this.x, this.y, this.width, this.height);
                }
                break;
        }
    }

    get currentFrame() {
        return {
            x: Math.floor(this.frameX) * this.frameWidth,
            y: Math.floor(this.frameY) * this.frameHeight,
            width: this.frameWidth,
            height: this.frameHeight
        };
    }
}

export class Stage {
    #canvasEl
    #ctx
    #width
    #height
    #isPixelated

    constructor(el, actors = [], animations = [], isPixelated) {
        this.#canvasEl = el.querySelector('canvas');
        this.#ctx = this.#canvasEl.getContext('2d');
        this.#isPixelated = isPixelated;
        this.actors = actors;
        this.animations = animations;
        setTimeout(this.start.bind(this), 100);
    }
    
    start() {
        const rect = this.#canvasEl.getBoundingClientRect();
        this.#width = rect.width;
        this.#height = rect.height;
    
        this.#canvasEl.width = this.#width;
        this.#canvasEl.height = this.#height;

        if (this.#isPixelated) {
            this.#ctx.imageSmoothingEnabled = false;
        }
        
        requestAnimationFrame(this.update.bind(this));
    }

    render() {
        const ctx = this.#ctx;
        ctx.clearRect(0, 0, this.#width, this.#height);
        this.actors.forEach(actor => actor.render(ctx));
    }

    update(timestamp) {
        if (!this.lastUpdate) {
            this.lastUpdate = timestamp;
        }
        const ellapsed = timestamp - this.lastUpdate;

        this.render();
        this.animations.forEach(anim => {
            const endingT = 1 + ((anim.delayAfter || 0) / anim.duration);
            anim.t += ellapsed / anim.duration;
            if (anim.loop && anim.t > endingT) {
                anim.t = 0;
            }

            const newValue = anim.interpolator.interpolate(anim.start, anim.end, Math.max(0, Math.min(1, anim.t)));
            anim.observable.value = newValue;
        });

        this.lastUpdate = timestamp;
        requestAnimationFrame(this.update.bind(this));
    }
}

export class StageBuilder {
    #el;
    #observed = [];
    #inputs = [];
    #actors = [];
    #animations = [];
    #canvasWidth;
    #canvasHeight;
    #isPixelated;
    
    constructor(el, width = 50, height = 50, isPixelated = false) {
        this.#el = el;
        this.#canvasWidth = width;
        this.#canvasHeight = height;
        this.#isPixelated = isPixelated;
    }

    attachObservedValue(observed) {
        const observedValue  = {
            name: observed.name,
            variable: new Observable(observed.value, observed.alwaysNotify || false),
            binding: observed.binding
        };
        this.#observed.push(observedValue);

        return this;
    }

    attachBoundInput(input) {
        if (!!input.formatter) {
            switch (input.formatter.type) {
                case 'number':
                    input.formatter = new NumberFormatter(input.formatter.decimals, input.formatter.rounding);
                    break;
                case 'color': 
                    input.formatter = new ColorFormatter();
                    break;
            }
        } else {
            input.formatter = new DummyFormater();
        }
        this.#inputs.push(input);
        return this;
    }

    attachActor(actor) {
        this.#actors.push(actor);
        return this;
    }

    attachAnimation(animation) {
        this.#animations.push(animation);
        return this;
    }

    build() {
        const canvasEl = document.createElement('canvas');
        canvasEl.width = this.#canvasWidth;
        canvasEl.height = this.#canvasHeight;
        this.#el.appendChild(canvasEl);
        
        this.#observed.filter(obs => obs.binding).forEach(obs => {
            const targetObservable = this.#observed.find(target => target.name === obs.binding.name);
            if (!targetObservable) {
                throw new Error(`An observable is bound to another but the target ${obs.binding.name} was not found.`);
            }
            targetObservable.variable.observe(value => obs.variable.value = obs.binding.from(value));
        });

        this.#inputs.forEach(input => {
            const inputEl = document.createElement('input');
            inputEl.type = input.type || 'number';
            inputEl.placeholder = input.label || '';
            Object.keys(input.attrs || {}).forEach(attr => {
                inputEl.setAttribute(attr, input.attrs[attr]);
            });
            (input.classes || []).forEach(c => inputEl.classList.add(c));

            const labelEl = document.createElement('label');
            labelEl.innerHTML = input.label;
            labelEl.appendChild(inputEl);
            labelEl.classList.add('bound-input');
            this.#el.appendChild(labelEl);

            const observed = this.#observed.find(obs => obs.name === input.observable);
            if (!observed) {
                throw new Error(`An input was attached to a stage but a proper observable with name ${input.observable} was not found.`);
            }

            inputEl.addEventListener('input', e => observed.variable.value = inputEl.value);
            inputEl.value = input.formatter.format(observed.variable.value);
            observed.variable.observe((prev, curr) => inputEl.value = input.formatter.format(curr));
        });


        const actors = this.#actors.map(actor => {
            actor.bindings = actor.bindings || [];
            actor.bindings = actor.bindings.map(b => ({property: b.property, observable: this.#observed.find(o => o.name === b.name).variable}));
            switch (actor.type) {
                case 'stroke-rectangle':
                case 'fill-rectangle':
                case 'stroke-circle':
                case 'fill-circle':
                    return new ShapeActor(actor);
                case 'single-image':
                case 'sheet-image':
                    return new ImageActor(actor);
            }
        });

        const animations = this.#animations.map(anim => {
            anim.observable = this.#observed.find(obs => obs.name === anim.observable).variable
            anim.t = 0;
            if (anim.observable.value instanceof Color) {
                anim.interpolator = new ColorInterpolator();
            } else {
                anim.interpolator = new NumberInterpolator();
            }
            return anim;
        });
        return new Stage(this.#el, actors, animations, this.#isPixelated);
    }
}