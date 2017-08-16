/*
essa é a parte mais feia do código
nao espere design patterns, boas praticas, e etc.

então, aqui basicamente eu manipulo o DOM e intenraçoes
da pagina, nada além de iniciar e adicionar processos e etc.
*/

class Gerenciador {

	constructor() {
		this._listaProcessofifo = [];
		this._listaProcessoSjf = [];
		this._listaProcessoedf = [];
		this._listaProcessoRR = [];
	}

	adiciona(event) {
		event.preventDefault();
		let tempo = $("#tempo").val();
		let chegada = $("#chegada").val();
		let deadline = $("#deadline").val();
		let pid = `#${Math.round(Math.random() * (99999 - 1000) + 1000)}`;
		let buffer = $("#alpha").val();

		let processo = new Processo(pid, parseInt(tempo), parseInt(chegada), parseInt(deadline));

		$('#listaDeProcessos').append(`<tr>
			<td id="processoNome${pid}">${pid}</td>
			<td>${tempo}</td>
			<td>${chegada}</td>
			<td>${deadline}</td>
			<td></td>
		</tr>`);


		if( this._listaProcessoedf.length > buffer) {
			this._listaProcessofifo.push(processo);
		}
			

		if(this._listaProcessoSjf < buffer){
			this._listaProcessoSjf.push(processo);			
		}

		if(this._listaProcessoedf < buffer){
			this._listaProcessoedf.push(processo);
		}
			

		if(this._listaProcessoRR < buffer){
			this._listaProcessoRR.push(processo);
		}
			

		$('#myModal').modal('hide');

		this.setAllBlank();

	}

	startFifo(event) {
		event.preventDefault();

		if (this._listaProcessoRR.length == 0) {
			this.error("Defina os processos", "Obrigatório");
			return;
		}
		this.escalonamento = new Escalonamento();
		let result = {};
		result = this.escalonamento.fifo(this._listaProcessofifo);

		$('#turnaroundFifo').html(result.total);
		$('#fifoDescription').html(result.string);
		$('#btn-fifo').attr('disabled', true);

	}

	startSJF(event) {
		event.preventDefault();

		if (this._listaProcessoRR.length == 0) {
			this.error("Defina os processos", "Obrigatório");
			return;
		}
		let result = {};
		this.escalonamento = new Escalonamento();
		result = this.escalonamento.sjf(this._listaProcessoSjf);

		$('#turnaroundsjf').html(result.total);
		$('#sjfDescription').html(result.string);
		$('#btn-sjf').attr('disabled', true);
	}

	startEDF(event) {
		event.preventDefault();
		let quantum = $('#quantum').val();
		if (quantum == "" || quantum < 1) {
			this.error("Defina o quantum", "Obrigatório");
			return;
		}
		if (this._listaProcessoRR.length == 0) {
			this.error("Defina os processos", "Obrigatório");
			return;
		}

		let result = {};
		this.escalonamento = new Escalonamento();
		result = this.escalonamento.edf(this._listaProcessoedf, quantum);

		$('#turnaroundEdf').html(result.total);
		$('#EdfDescription').html(result.string);

		$('#btn-edf').attr('disabled', true);
	}

	startRR(event) {
		event.preventDefault();
		let quantum = $('#quantum').val();
		if (quantum == "" || quantum < 1) {
			this.error("Defina o quantum", "Obrigatório");
			return;
		}
		if (this._listaProcessoRR.length == 0) {
			this.error("Defina os processos", "Obrigatório");
			return;
		}

		let result = {};
		this.escalonamento = new Escalonamento();
		result = this.escalonamento.roundRobin(this._listaProcessoRR, quantum);
		$('#turnaroundRR').html(result.total);
		$('#RRDescription').html(result.string);
		$('#btn-rr').attr('disabled', true);
	}

	limpar() {
		this._listaProcessofifo = [];
		this._listaProcessoSjf = [];
		this._listaProcessoedf = [];
		this._listaProcessoRR = [];
		$('#btn-fifo, #btn-edf, #btn-rr, #btn-sjf').attr('disabled', false);
		$('#listaDeProcessos').empty();
		$('#turnaroundRR, #turnaroundEdf, #turnaroundsjf, #turnaroundFifo').html('');
		$('#quantum').val("");
		$('#RRDescription, #EdfDescription, #sjfDescription, #fifoDescription').empty();

	}

	setAllBlank() {
		let tempo = $("#tempo").val("");
		let chegada = $("#chegada").val("");
		let deadline = $("#deadline").val("");
	}

	error(msg, title) {
		toastr.error(msg, title);
	}


}
