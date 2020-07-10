import { Animacao } from "./animacao.js";

export class Sprite {
    constructor(imagem, x, y, largura, altura) {
        this.imagem = imagem;
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.animacoes = [];
        this.imagemPronta = false;
        imagem.addEventListener('load', () => this.imagemPronta = true);
    }

    desenhar(ctx) {
        if (this.imagemPronta) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        }
    }

    atualizar() {
        this.animacoes.forEach(animacao => animacao.atualizar());
    }
}


export class SpriteAnimada extends Sprite {
    constructor(imagem, x, y, largura, altura, larguraQuadro, alturaQuadro, clips, clipAtual) {
        super(imagem, x, y, largura, altura);
        this.larguraQuadro = larguraQuadro;
        this.alturaQuadro = alturaQuadro;
        clips.forEach(clip => this.animacoes.push(clip));
        this.clips = clips.reduce((accum, clip) => {
            accum[clip.nome] = clip;
            return accum;
        }, {});
        this.clipAtual = this.clips[clipAtual];
        this.clipAtual.comecar();
        imagem.addEventListener('load', () => {
           this.colunas = (+imagem.width) / this.larguraQuadro;
           this.linhas = (+imagem.height) / this.alturaQuadro;
        });
    }

    desenhar(ctx) {
        if (this.imagemPronta) {
            const quadro = this.quadro;
            ctx.drawImage(this.imagem, quadro.x, quadro.y, this.larguraQuadro, this.alturaQuadro, this.x, this.y, this.largura, this.altura);
        }
    }

    animar(nomeClip) {
        this.clipAtual = this.clips[nomeClip];
        this.clipAtual.comecar();
    }

    get quadro() {
        const indiceQuadro = this.clipAtual.quadro;
        return {
            x: (indiceQuadro % this.colunas) * this.larguraQuadro,
            y: Math.floor(indiceQuadro / this.colunas) * this.alturaQuadro
        };
    }
}

export class Clip extends Animacao {
    constructor(nome, sequenciaQuadros, duracao, loop = true, quandoTerminar) {
        super(duracao, 0, sequenciaQuadros.length, loop, quandoTerminar);
        this.nome = nome;
        this.sequenciaQuadros = sequenciaQuadros;
    }

    get quadro() {
        const indice = Math.max(0, Math.min(this.sequenciaQuadros.length - 1, Math.floor(super.valor)));
        return this.sequenciaQuadros[indice];
    }
}