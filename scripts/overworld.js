import { SpriteAnimada, Clip } from './sprite.js';
import { Animacao } from './animacao.js';

export class Overworld {
    constructor(container, characterContainer, mapContainer) {
        const spriteImage = new Image();
        this.characterContainer = characterContainer;
        spriteImage.src = 'imgs/slime-vermelha.png';
        this.character = new SpriteAnimada(spriteImage, 0, 0, 24, 24, 24, 24, [
            new Clip('idle', [6, 7, 8], 500, true),
            new Clip('right', [3, 4, 5], 500, true)
        ], 'idle');
        this.level = 0;

        this.canvasEl = document.createElement('canvas');
        this.canvasEl.width = mapContainer.offsetWidth;
        this.canvasEl.height = 48;
        this.canvasEl.imageSmoothingEnabled = false;
        this.ctx = this.canvasEl.getContext('2d');
        characterContainer.appendChild(this.canvasEl);

        this.moveToLevel(0);
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.character.desenhar(ctx);
        this.character.atualizar();
        if (this.xAnimation) {
            this.character.x = this.xAnimation.valor;
        }
        requestAnimationFrame(this.update.bind(this));
    }

    moveToLevel(level) {
        this.xAnimation = new Animacao(1200, this.character.x, this.getLevelX(level), false, () => {
            this.level = level;
            this.character.animar('idle');
        });
        this.character.animacoes.push(this.xAnimation);
        this.xAnimation.comecar();
        this.character.animar('right');
    }

    finishGame() {
        document.querySelector('.logo').classList.add('jumping');
        this.characterContainer.classList.add('jumping');
    }

    getLevelX(level) {
        const levelWidth = 142;
        return level * levelWidth + levelWidth / 2 - 10;
    }
}