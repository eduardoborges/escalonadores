/**
 * Modelo do Processo
 *  nome - Nome do processo
 *  tempo - Tempo de processamento
 *  executado - Se ele foi executado
 *  tempoGasto - Tempo Gasto pelo processo
 *  chegada - Momento de chegada
 *  pendente - Se esta pendente
 *  naFila - Se Está na Fila
 *  deadLine - Tempo maximo de execução
 *  estorou - True se ultrapassou o deadLine
 */
class Processo {


	constructor(nome, tempo, chegada = 0, deadLine = 0, pendente = false, naFila = false, estorou = false, tempoGasto = 0) {
		this._nome = nome;
		this._tempo = tempo;
		this._executado = 0;
		this._tempoGasto = tempoGasto;
		this._chegada = chegada;
		this._pendente = pendente;
		this._naFila = naFila;
		this._deadLine = deadLine;
		this._estorou = estorou;
		this._index = null;
	}

	get nome(){
		return this._nome;
	}

	get tempo(){
		return this._tempo;
	}

	get index(){
		return this._index;
	}

	set index (index){
		this._index = index;
	}


	get executado(){
		return this._executado;
	}

	set executado (executado){
		this._executado = executado;
	}

	get tempoGasto() {
		return this._tempoGasto;
	}

	set tempoGasto (tempoGasto){
		this._tempoGasto = tempoGasto;
	}

	get chegada () {
		return this._chegada;
	}

	get pendente () {
		return this._pendente
	}

	set pendente (pendente){
		this._pendente = pendente;
	}


	get naFila () {
		return this._naFila
	}


	set naFila (naFila){
		this._naFila = naFila;
	}


	get deadLine () {
		return this._deadLine;
	}

	get estorou (){
		return this._estorou;
	}

	set estorou (estorou){
		this._estorou = estorou;
	}

}
