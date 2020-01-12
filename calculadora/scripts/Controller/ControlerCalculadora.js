class ControlerCalculadora{

    constructor(){
        this._data = document.querySelector("#data");
        this._hora = document.querySelector("#horas");
        this._display = document.querySelector("#display");
        this._dataAtual;
        this.iniciaCalculadora();
        this.iniciaEventosBotao();
        this.iniciaEventosTeclado();
        this._operacoes = [];
        this._ultimaOperacao = '';
        this._ultimoNumero = '';
        this._audioLigadoOuDesligado = false;
        this._audio = new Audio('click.mp3');
    }

    iniciaCalculadora(){
        this.iniciaDataHora();

        setInterval(()=>{
            this.iniciaDataHora();
        })
        this.colarParaAreaTransferencia();

        //para trabalhar com audio no botão adicionar evento click
    //adicionando evento de audio
    document.querySelectorAll('.audio').forEach(btn=>{
        btn.addEventListener('dblclick', e=>{
           //ta ligado desliga ta desligado liga
           this.alternarAudio();
        })
     })
    }

    alternarAudio(){
        this._audioLigadoOuDesligado = !this._audioLigadoOuDesligado;
    }

    reproduzirAudio(){
        if(this._audioLigadoOuDesligado){
           this._audio.currentTime = 0;
           this._audio.play() ;
        }
    }
   
    iniciaDataHora(){
        this.hora = this.dataAtual.toLocaleTimeString();
        this.data = this.dataAtual.toLocaleDateString();
    }

    adcionarMultiplosEventos(elemento, eventos, funcao){
       eventos.split(' ').forEach(event=>{
            elemento.addEventListener(event, funcao);
       });
    }

    limparTodasOperacoes(){
        this._operacoes = [];
        this.ultimoNumeroDigitadoDisplay();
       
    }

    limparUltimaOperacao(){
      this._operacoes.pop();
      this.ultimoNumeroDigitadoDisplay();
      
    }

    pegarUltimoItemOperacoes(){
        return this._operacoes[this._operacoes.length-1];
     }
    
    eOperador(valor){
     return  (['/', '√', '**', '¹/x', '+', '-', '%', '/', '±', '*'].indexOf(valor) > -1);
    }

    trocarValorUltimoItem(valor){
        this._operacoes[this._operacoes.length-1] = valor;
    }

    calcular(){
        let ultimoItem = '';
        this._ultimaOperacao = this.ultimoOperadorDigitado();
        //para verificar se temos menos de tres item para não da erro
        if(this._operacoes.length < 3){
            let primeiroItem = this._operacoes[0];
            this._operacoes = [primeiroItem,this._ultimaOperacao,this._ultimoNumero]
        }
        //so posso tirar o ultimo se for maior que tres indices
        
        if(this._operacoes.length > 3){
           //pegar ultimo item
           ultimoItem = this._operacoes.pop();
            
           //guarda o ultimo operador
           //this._ultimaOperacao = this.ultimoOperadorDigitado();

           this._ultimoNumero = eval(this._operacoes.join(""));
          

        }else if(this._operacoes.length == 3){

           this._ultimoNumero = this.ultimoNumeroDigitadoDisplay();
           //guarda ultimo numero digitado
           //this._ultimaOperacao = this.ultimoOperadorDigitado();

        }
          

        ////////////////////////////////////////////////////
        //Calculo de porcentagem
        if(ultimoItem == '%'){
            let resultado = eval(this._operacoes.join(""));
            resultado /= 100;
            this._operacoes = [resultado];
        }else{
            //transformar e string
            let resultado = eval(this._operacoes.join(""));
            //substituir
            //this._operacoes = [resultado,ultimoItem];
            this._operacoes = [resultado];
            
            //se ultimoItem for diferente de vazio inclua
            if(ultimoItem) this._operacoes.push(ultimoItem)
        }
        
        this.ultimoNumeroDigitadoDisplay();
    }

    erroNaOperacao(){
        this.display = '<h4>ERROR<h4>';
    }

    inserirValor(valor){
        this._operacoes.push(valor);
        //se tiver mais de três item somar
        if(this._operacoes.length > 3){
            this.calcular();
        }
    }
    
    //para mostrar no display
    ultimoNumeroDigitadoDisplay(){
       let ultimoNumero;

       for(let i = this._operacoes.length-1; i >=0; i--){
           if(!this.eOperador(this._operacoes[i])){
               ultimoNumero = this._operacoes[i];
               break;
           }
       }
       
       //se não existir numero inclua zero
       if(!ultimoNumero) ultimoNumero = 0;
       //colocar o valores no Display
       this.display = ultimoNumero;

       return ultimoNumero;
    }

    ultimoOperadorDigitado( eOperador = true){
        let ultimoOperador;

        for(let i = this._operacoes.length-1; i >=0; i--){
            if(this.eOperador(this._operacoes[i])){
                ultimoOperador = this._operacoes[i];
                break;
            }
        }
        //se não emcontrar nem um operador continua com o mesmo
        if(!ultimoOperador){
            ultimoOperador = (eOperador) ? this._ultimaOperacao : this._ultimoNumero;
        }
        return ultimoOperador;
    }

    adicionarOperacoes(valor){
        if(isNaN(this.pegarUltimoItemOperacoes())){
         //string = true
         if(this.eOperador(valor)){
             this.trocarValorUltimoItem(valor);
            //trocar o operador
         }else if(isNaN(valor)){
          //e outra coisa
         
         }else{
          this.inserirValor(valor);

          this.ultimoNumeroDigitadoDisplay();
         }

        }else{
            //adicionar os operadores
            if(this.eOperador(valor)){
             this.inserirValor(valor);
            }else{
                let novoValor = this.pegarUltimoItemOperacoes().toString() + valor.toString();
                this.trocarValorUltimoItem(novoValor);
                //numerico

                //mostrar ultimo numero digitado

                this.ultimoNumeroDigitadoDisplay();
            }
        }
    
    }
    
    adicionarPonto(){
        let ultimoItemArray = this.pegarUltimoItemOperacoes();
         //verificar se ela possui mais de um ponto
        //se colocar ponto mais de uma vez para execucao

        if(typeof ultimoItemArray === 'string' && ultimoItemArray.split('').indexOf('.') > -1) return;
        //return = para execução metodo
        //se for um  operador ou não for vazio
        if(this.eOperador(ultimoItemArray) || !ultimoItemArray){
            this.inserirValor('0.')
        }else{
           this.trocarValorUltimoItem(ultimoItemArray.toString() + '.');
        }
        this.ultimoNumeroDigitadoDisplay();
    }

    copiaParaAreaDeTransferencia(){
        //criar um input
        let input = document.createElement('input');
        //pegar o valor do meus display
        input.value = this.display;
        //pegar a informação e copia para sistema operacional
        document.body.appendChild(input);
        //para selecionar
        input.select();
        //copia para sistema operacional
        document.execCommand("Copy");

        input.remove();

    }
   
    colarParaAreaTransferencia(){
     
        document.addEventListener('paste' ,e=>{
  
           let text =  e.clipboardData.getData('Text');
           this._operacoes = [parseFloat(text)];
           this.display = parseFloat(text);
  
        });
  
    }

    aoQuadrado(){
        if(this.ultimoOperadorDigitado() == '**'){
            this._operacoes.push("2");
            
        }

    }

    maisOuMenos(){
       let menos = this.ultimoNumeroDigitadoDisplay();
       let mn = this.trocarValorUltimoItem('-' + menos.toString());
       this.ultimoNumeroDigitadoDisplay() + '-';
       

    }

    raizQuadrada(){
        if(this.ultimoOperadorDigitado() == '**'){
            this._operacoes.push("0.5");
           
        }
    }

    executarAcaoBotao(valor){
        this.reproduzirAudio()
       switch (valor) {
           case '%':
               this.adicionarOperacoes('%');
               break;
            
            case '√':
               this.adicionarOperacoes('**');
               this.raizQuadrada();
               break;

            case 'x²':
                this.adicionarOperacoes('**');
                this.aoQuadrado();
                break;

            case '¹/x':
                this.adicionarOperacoes('/');
                break;
            
            case 'CE':
                this.limparUltimaOperacao();
                break;
            
            case 'C':
                this.limparTodasOperacoes();
                break;

            case '←':
                this.limparUltimaOperacao();
                break;

            case '÷':
                this.adicionarOperacoes('/');
                break;

            case 'X':
                this.adicionarOperacoes('*');
                break;

            case '-':
                this.adicionarOperacoes('-');
                break;

            case '+':
                this.adicionarOperacoes('+');
                break;

            case '=':
                this.calcular();
                break;
            
            case ',':
                this.adicionarPonto();
                break;

            case '±':
                this.maisOuMenos();
                break;

            

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            this.adicionarOperacoes(parseInt(valor));
            
            break;

           default:
               break;
       }
    }

    iniciaEventosTeclado(){
        document.addEventListener('keyup', e=>{
            this.reproduzirAudio();
            //console.log(e.key);
            switch (e.key) {

                case 'Backspace':
                    this.limparUltimaOperacao();
                    break;

                case 'Escape':
                    this.limparTodasOperacoes();
                    break;
        
                case '÷':
                case '/':
                    this.adicionarOperacoes('/');
                     break;
        
                case 'x':
                case 'X':
                case '*':
                        this.adicionarOperacoes('*');
                        break;
                case '-':
                        this.adicionarOperacoes('-');
                        break;
        
                case '+':
                        this.adicionarOperacoes('+');
                        break;
                     
                
                case '=':
                    this.calcular();
                    break;
                
                case ',':
                case '.':
                    this.adicionarPonto();
                    break;

                case 'Dead':
                    this.adicionarOperacoes('**');
                    this.aoQuadrado();
                    break;
                    
                    case '0':
                    case '1':          
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        this.adicionarOperacoes(parseInt(e.key))
                        break;

                    case 'c':
                        if(e.ctrlKey) this.copiaParaAreaDeTransferencia();
                        break;

                   
            
                default:
                    break;
            }
        })
    }

    iniciaEventosBotao(){
        
        //pegar todos os meus botao
        let butao = document.querySelectorAll(".linha > .col-sm");
         //adicionar eventos em todos os botão 
        butao.forEach((btn, index) =>{


            this.adcionarMultiplosEventos(btn, "click drag",funcao=>{
               let valorBotao = btn.innerHTML;
              

               this.executarAcaoBotao(valorBotao);

            });

        });

    }

    get display(){
        return this._display.innerHTML;
    }

    set display(valor){
        if(valor.toString().length > 25){
           this.erroNaOperacao();
           return false;
        }
        return this._display.innerHTML = valor;
    }

    get data(){

        return this._data.innerHTML;
    }

    set data(valor){
        return this._data.innerHTML = valor;
    }

    get hora(){
       return this._hora.innerHTML;
    }

    set hora(valor){
        return this._hora.innerHTML = valor;
    }
     
    get dataAtual(){
        return new Date();
    }

    set dataAtual(valor){
        this._dataAtual = valor;
    }

}