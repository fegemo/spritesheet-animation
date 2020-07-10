import { SpriteAnimada, Clip } from './sprite.js';
import playAudio from './jukebox.js';

export class Rewards {
    constructor(rewardElements) {
        const treasureImage = new Image();
        treasureImage.src = 'imgs/treasure-chests.png';
        const sparkImage = new Image();
        sparkImage.src = 'imgs/spark.png';
        this.rewards = Array.from(rewardElements).map(el => {
            return {
                el,
                reward: new Reward(el, treasureImage, sparkImage)
            };
        });
    }

    unlock(el) {
        const reward = this.rewards.find(r => r.el === el).reward;
        reward.unlock();
    }
}

class Reward {
    constructor(el, image, sparkImage) {
        this.el = el;
        this.prizeEl = document.querySelector(el.dataset.prize);
        this.lines = 12;
        this.columns = 10;
        this.frameX = +el.dataset.frameX;
        this.frameY = +el.dataset.frameY;
        this.canvasActiveEl = el.querySelector('.visible canvas');
        this.canvasLockedEl = el.querySelector('.hidden canvas');
        this.canvases = [];
        this.canvases.push(this.configCanvas(this.canvasLockedEl, image, this.frameX, this.frameY));
        this.canvases.push(this.configCanvas(this.canvasActiveEl, image, this.frameX, this.frameY));
        this.canvases[0].ctx.filter = 'grayscale()';
        this.canvases[1].ctx.filter = 'grayscale()';
        this.canvases[1].showSpark = true;
        this.claimed = false;
        this.unlocked = false;
        this.sparkSprite = new SpriteAnimada(sparkImage, -6, -9, 60, 66, 45, 51, [
            new Clip('appearing', [0, 1, 2, 3], 400, false, () => this.sparkSprite.animar('idle')),
            new Clip('idle', [4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 5], 1200, true)
        ], 'appearing');

        this.claim = this.claim.bind(this);
        this.showPrize = this.showPrize.bind(this);
        requestAnimationFrame(this.update.bind(this));
    }
    
    unlock() {
        playAudio('coin');
        this.canvases.forEach(c => c.ctx.filter = 'none');
        this.unlocked = true;
        this.sparkSprite.animar('appearing');
        
        this.el.addEventListener('click', this.claim);
    }
    
    claim() {
        playAudio('treasure');
        this.el.removeEventListener('click', this.claim);
        this.claimed = true;
        this.canvases[0].sprite.animar('open');
        this.el.classList.add('claimed');

        this.el.addEventListener('click', this.showPrize);
        setTimeout(() => this.showPrize(), 500);
    }

    showPrize() {
        $(this.prizeEl).modal('show');
    }

    configCanvas(canvasEl, image) {
        const ctx = canvasEl.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const sprite = new SpriteAnimada(image, 8, 8, 32, 32, 32, 32, [
            new Clip('closed', [this.frameX + this.frameY * this.columns], 0, false),
            new Clip('open', [this.frameX + (1+this.frameY) * this.columns], 0, false)
        ], 'closed');

        return {
            ctx,
            sprite,
            el: canvasEl
        };
    }

    update() {
        this.canvases.forEach(c => {
            c.ctx.clearRect(0, 0, c.el.width, c.el.height);
            if (this.unlocked && !this.claimed && this.sparkSprite && c.showSpark) {
                this.sparkSprite.desenhar(c.ctx);
                this.sparkSprite.atualizar();
            }
            c.sprite.desenhar(c.ctx);
            c.sprite.atualizar();
        });

        requestAnimationFrame(this.update.bind(this));
    }
}