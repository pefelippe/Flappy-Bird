
function novoElemento (tagName, className) {
    const elem = document.createElement(tagName);
    elem.className=className;
    return elem;
}

function novaBarreira(reversa = false) {
    this.elemento = novoElemento("div", 'barreira');

    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    
    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function parDeBarreira(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras');

    this.superior = new novaBarreira(true);
    this.inferior = new novaBarreira(false);

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;

        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);

    }

    this.getX = () => parseInt (this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new parDeBarreira(altura, abertura, largura),
        new parDeBarreira(altura, abertura, largura + 1 * espaco),
        new parDeBarreira(altura, abertura, largura + 2 * espaco),
        new parDeBarreira(altura, abertura, largura + 3 * espaco)
    ];

    const deslocamento = 4;
    
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)
            
            // quando elemento sair da tela
            if(par.getX() < -par.getLargura(0)){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzou = par.getX() + deslocamento >= meio && par.getX() < meio

             if (cruzou) {
                 notificarPonto()
             }
            
        })
    }
}

function Passaro (alturaJogo) {
    let voando = false;

    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = './assets/passaro.png';

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.setY = y => this.elemento.style.bottom = `${y}px`;

    window.onkeydown = e => voando = true;
    window.onkeyup = e => voando = false;

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMax = alturaJogo - this.elemento.clientWidth

        if (novoY <= 0) this.setY(0);
        else if (novoY >= alturaMax) this.setY(alturaMax);
        else this.setY(novoY)
    }

    this.setY(alturaJogo / 2);
}

function Progresso(){
    this.elemento = novoElemento('span', 'progresso');
    this.atualizarPontos = (value) => {
        this.elemento.innerHTML = value;

   }
   this.atualizarPontos(0)
}

function isSobreposto (elemA, elemB){
    const a = elemA.getBoundingClientRect();
    const b = elemB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical;
}

function colision(passaro, barreiras){
    let colision = false

    barreiras.pares.forEach(parDeBarreira => {
        if(!colision){
            const sup = parDeBarreira.superior.elemento;
            const inf = parDeBarreira.inferior.elemento;

            colision = isSobreposto(passaro.elemento, sup)
                    || isSobreposto(passaro.elemento, inf)   
        }
    })

    return colision
}

function endGame(msg) {
    this.elemento = novoElemento('span', 'end-game');
    this.elemento = novoElemento('p', 'end-game');

    this.mostrar = () => {
        this.elemento.innerHTML = 'Fim do Jogo';
   }
}

function flappyBird(){
    let pontos = 0;

    const areaJogo = document.querySelector('[wm-flappy]')
    const altura = areaJogo.clientHeight;
    const largura = areaJogo.clientWidth;

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400, 
        () => progresso.atualizarPontos(++pontos) );
    const passaro   = new Passaro(altura)
    const endgame = new endGame();

    areaJogo.appendChild(passaro.elemento)
    areaJogo.appendChild(progresso.elemento)
    areaJogo.appendChild(endgame.elemento)

    barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if (colision(passaro, barreiras)) {
                clearInterval(temporizador)
                


            }

        }, 20)
    }
}

new flappyBird().start();


