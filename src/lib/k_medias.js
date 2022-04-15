'use strict'

exports.k_medias = class k_medias {

    constructor(datos) {
        this.epsilon = 0.01;
        this.b = 2;
        this.v = [
            [4.6, 3.0, 4.0, 0.0],
            [6.8, 3.4, 4.6, 0.7]
        ];


        datos = datos.split('\n');
        datos = datos.map(line => line.replace('\r', ''));
        datos = datos.filter(line => line.length > 0);
        datos = datos.map(line => line.split(','));

        this.x = datos;
        this.k = 2;
        this.distancia = [];
        this.u = [];
        for (let i = 0; i < this.x.length; i++) {
            this.distancia.push(new Array(this.k));
            this.u.push(new Array(this.k));
        }

        console.log(this.distancia);
    }

    normalizar(x, v) {
        return Math.sqrt(1); //TODO sqrt(sum((x-v).^2))
    }

    gradoPertenencia(i, j) {
        return (Math.pow(1/this.distancia[i][j], 1/(this.b-1)))
            /
            (Math.pow(this.sum(), 1/(this.b-1)));
        //TODO
        // ((1/distancia(i,j))^(1/(b-1)))
        // /
        // ((sum(1./distancia(:, j)))^(1/(b-1)))
    }

    sum(v) {
        let sum = 0;
        v.forEach(value => sum+= value);
        return sum;
    }

    calcular() {
        let vAnterior;
        do {
            for (let i = 1; i <= this.k; i++) {
                for (let j = 1; j <= this.x.length; j++) {
                    this.distancia[i][j] = Math.pow(this.normalizar(this.x[j], this.v[i]), 2);
                }
            }

            for (let i = 1; i <= this.k; i++) {
                for (let j = 1; j <= this.x.length; j++) {
                    this.u[i][j] = this.gradoPertenencia(i, j);
                }
            }

            vAnterior = this.v;
            const dividendo = [];
            const divisor = [];


            for (let i = 1; i <= this.k; i++) {
                for (let j = 1; j <= this.x.length; j++) {
                    dividendo.push(Math.pow(this.u, this.b) * this.x[j]);
                }

                for (let j = 1; j <= this.x.length; j++) {
                    divisor.push(Math.pow(this.u[i][j], this.b));
                }

                this.v[i] = this.sum(dividendo) / this.sum(divisor);
            }
        } while(
            this.normalizar(this.v[0], vAnterior[0]) < this.epsilon &&
            this.normalizar(this.v[1], vAnterior[1]) < this.epsilon
        );
    }
}
