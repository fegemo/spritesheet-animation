export class Animacao {
    constructor(duracao, inicial, final, loop = true, quandoTerminar) {
        this.duracao = duracao;
        this.inicial = inicial;
        this.final = final;
        this.loop = loop;
        this.quandoTerminar = quandoTerminar;
        this.executando = false;
    }

    comecar() {
        this.horarioInicio = performance.now();
        this.t = 0;
        this.executando = true;
    }

    atualizar() {
        if (!this.executando) {
            return;
        }

        const horarioAgora = performance.now();
        const tempoQueSePassou = horarioAgora - this.horarioInicio;

        this.t = tempoQueSePassou / this.duracao;

        if (this.t > 1) {
            if (this.loop) {
                this.t = 0;
                this.horarioInicio = horarioAgora;
            } else {
                this.t = 1;
                this.executando = false;
            }
            if (this.quandoTerminar) {
                this.quandoTerminar();
            }
        }
    }

    get valor() {
        return this.t * (this.final - this.inicial) + this.inicial;
    }
}