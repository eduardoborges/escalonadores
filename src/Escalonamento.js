/**
 * Algoritimos que ACHO que dá pra implementar 
 *
 * FIFO
 * SJF
 * Round Robin
 * EDF
 *
 * Favor comentar todos os commits e testar antes de commitar, sob pena de levar cascudo!
 * Mas tbm n precisa fazer unit test (mas seria o recomendado) mas testa o negocio vei.
 */
class Escalonamento {
	/* * Utilizando ECMASCRIPT 6,  <3 **/

	constructor() {
		this._sobrecarga = 1;
	}

	/**
	 * Algoritmo de Escalonamento FIFO.
	 * @param lProcesso - Lista de Processos.
	 * @returns {{total: number, string: string}}
	 */
	fifo(lProcesso) {
		let stringSaida = "";
		let processos = this.ordernar(lProcesso, 1);
		let fila = [];
		let tempoReal = 0;
		let processosRestantes = processos.length;
		while (processosRestantes > 0) {
			// Cria a fila a cada interação
			fila = [];
			let processoPedente = false;
			processos.forEach(function (p) {
				if (p.chegada <= tempoReal && p.executado < p.tempo && p.pendente == false) {
					p.naFila = true;
					fila.push(p);
					stringSaida += "Adicionado " + p.nome + " na fila. \n";
				}
				if (p.pendente == true) {
					processoPedente = true;
				}
				p.pendente = false;

			});

			if (fila.length == 0 && processoPedente == false) {
				//Se a fila estiver zerada, incrementa o tempo
				stringSaida += 'Fila Vazia \n';
				tempoReal++;
			}

			fila.forEach(function (p) {
				if (p.naFila == false) {
					return;
				}

				p.naFila = false; // Tira da Fila, pois já está executando.
				tempoReal += p.tempo;
				stringSaida += "Executando o processo: " + p.nome + " \n";
				p.executado += p.tempo;

				if (p.executado == p.tempo) {
					processosRestantes--;
					p.tempoGasto = tempoReal - p.chegada;
					stringSaida += 'Terminou: ' + p.nome + " \n";
				} else {
					p.pendente = true;
					console.log('Houve Algum erro');
				}
			});
		}


		let total = 0;
		processos.forEach(function (p) {
			total += p.tempoGasto;
		});
		console.log("Tempo medio: " + total / processos.length);
		return {total: total / processos.length, string: stringSaida};
	}

	/**
	 * Algoritmo de escalonamento RoundRobin
	 * @param lProcesso - Lista de processos
	 * @param vQuantum - Quantum
	 * @returns {{total: number, string: string}}
	 */
	roundRobin(lProcesso, vQuantum) {
		let stringSaida = "";
		let processos = this.ordernar(lProcesso, 1);
		let quantum = parseInt(vQuantum), sobrecarga = this._sobrecarga;
		let tempoReal = 0;
		let fila = [];
		let processosRestantes = processos.length;

		while (processosRestantes > 0) {
			// Cria a fila a cada interação
			fila = [];
			let processoPedente = false;
			processos.forEach(function (p) {
				if (p.chegada <= tempoReal && p.executado < p.tempo && p.pendente == false) {
					p.naFila = true;
					fila.push(p);
					stringSaida += "Adicionado " + p.nome + " na fila. \n";
				}
				if (p.pendente == true) {
					processoPedente = true;
				}
				p.pendente = false;
			});

			if (fila.length == 0 && processoPedente == false) {
				//Se a fila estiver zerada, incrementa o tempo
				stringSaida += 'Fila Vazia \n';
				tempoReal++;
			}

			fila.forEach(function (p) {
				if (p.naFila == false) {
					return;
				}

				p.naFila = false; // Tira da Fila, pois já está executando.
				tempoReal += Math.min(p.tempo - p.executado, quantum);
				stringSaida += "Executando o processo: " + p.nome + "\n";
				p.executado += Math.min(p.tempo - p.executado, quantum);

				console.log(p.executado + '<--- Executado Tempo ---->' + p.tempo);

				if (p.executado == p.tempo) {
					processosRestantes--;
					p.tempoGasto = tempoReal - p.chegada;
					stringSaida += 'Terminou: ' + p.nome + "\n";
				} else {
					p.pendente = true;
					tempoReal += sobrecarga;
					stringSaida += 'Sobrecarga \n';
				}
			});
		}


		let total = 0;
		processos.forEach(function (p) {
			total += p.tempoGasto;
		});
		console.log("Tempo medio: " + total / processos.length);

		return {total: total / processos.length, string: stringSaida};
	}

	/**
	 * Algoritmo de Escalonamento EDF
	 * @param lProcesso - Lista de Processos a escalonar
	 * @param vQuantum - Quantum.
	 * @returns {{total: number, string: string}}
	 */
	edf(lProcesso, vQuantum) {
		let stringSaida = "";
		let processos = this.ordernar(lProcesso, 3);
		let quantum = parseInt(vQuantum), sobrecarga = this._sobrecarga;
		let fila = [];
		let tempoReal = 0;
		let processosRestantes = processos.length;

		while (processosRestantes > 0) {
			// Cria a fila a cada interação
			/**
			 * No EDF a fila só deve ter um processo. Pois caso apareça um processo com deadLine menor
			 * o mesmo deve ter prioridade
			 * O atributo pendente não deve ser utilizado. Pois prioridade é prioridade e deve ser obedecida.
			 */
			fila = [];
			let processoPedente = false;
			let deadLineAtual = -1;
			processos.forEach(function (p) {
				if (fila.length > 0 && deadLineAtual != p.deadLine) {
					return;
				}
				if (p.chegada <= tempoReal && p.executado < p.tempo) {
					p.naFila = true;
					fila.push(p);
					stringSaida += "Adicionado " + p.nome + " na fila. \n";
					deadLineAtual = p.deadLine;
				}
				if (p.pendente == true) {
					processoPedente = true;
				}
				p.pendente = false;
			});

			if (fila.length == 0 && processoPedente == false) {
				//Se a fila estiver zerada, incrementa o tempo
				stringSaida += 'Fila Vazia \n';
				tempoReal++;
			}

			fila.forEach(function (p) {
				if (p.naFila == false) {
					return;
				}

				p.naFila = false; // Tira da Fila, pois já está executando.
				tempoReal += Math.min(p.tempo - p.executado, quantum);
				stringSaida += "Executando o processo: " + p.nome + "\n";
				p.executado += Math.min(p.tempo - p.executado, quantum);
				// zzz
				if (p.executado == p.tempo) {
					if (tempoReal > p.deadLine) {
						p.estorou = true;
					}
					processosRestantes--;
					p.tempoGasto = tempoReal - p.chegada;
					stringSaida += 'Terminou: ' + p.nome + ";\n" + 'Estourou: ' + p.estorou + "\n";
				} else {
					p.pendente = true;
					tempoReal += sobrecarga;
					stringSaida += 'Sobrecarga \n';
				}
			});
		}

		let total = 0;
		processos.forEach(function (p) {
			total += p.tempoGasto;
		});
		console.log("Tempo medio: " + total / processos.length);
		return {total: total / processos.length, string: stringSaida};
	}

	/**
	 * Algoritmo de Escalonamento SJF
	 * @param lProcesso - Lista de Processos;
	 * @returns {{total: number, string: string}}
	 */
	sjf(lProcesso) {
		let stringSaida = "";
		let processos = this.ordernar(lProcesso, 4);
		let fila = [];
		let tempoReal = 0;
		let processosRestantes = processos.length;
		console.log(processos);

		while (processosRestantes > 0) {
			// Cria a fila a cada interação
			fila = [];
			let processoPedente = false;
			// deus me ajuda que eu me perdi nisso
			processos.forEach(function (p) {
				if (p.chegada <= tempoReal && p.executado < p.tempo && p.pendente == false) {
					p.naFila = true;
					fila.push(p);
					stringSaida += "Adicionado " + p.nome + " na fila. \n";
				}
				if (p.pendente == true) {
					processoPedente = true;
				}
				// deos me ajuda
				p.pendente = false;
			});

			if (fila.length == 0 && processoPedente == false) {
				//Se a fila estiver zerada, incrementa o tempo
				stringSaida += 'Fila Vazia \n';
				tempoReal++;
			}

			fila.forEach(function (p) {
				if (p.naFila == false) {
					return;
				}

				p.naFila = false; // Tira da Fila, pois já está executando.
				tempoReal += p.tempo;
				stringSaida += "Executando o processo: " + p.nome + "\n";
				p.executado += p.tempo;

				if (p.executado == p.tempo) {
					processosRestantes--;
					p.tempoGasto = tempoReal - p.chegada;
					stringSaida += 'Terminou: ' + p.nome + "\n";
				} else {
					p.pendente = true;
					console.log('Houve Algum erro');
					// console.log('deu merda nessa droga');
				}
			});
		}


		let total = 0;
		processos.forEach(function (p) {
			total += p.tempoGasto;
		});
		console.log("Tempo medio: " + total / processos.length);
		return {total: total / processos.length, string: stringSaida};
	}

	/**
	 * Metodo para ordenamento.
	 * @param array - Array a ser Ordenado
	 * @param type - Tipo da ordenação 1 - Chegada crescente, 2 - Chegada decrescente,
	 *  3 - DeadLine crescente, 4 - Tempo de execução crescente.
	 * @returns Array;
	 */
	ordernar(array, type = 1) {
		// gambiarra a vista, poderia fazer um map bonitinho mas n tempo AAAAAAAAAA
		array.sort(function (a, b) {
			if (type == 1) {
				if (a.chegada > b.chegada) {
					return 1;
				}
				if (a.chegada < b.chegada) {
					return -1;
				}
			} else if (type == 2) {
				if (a.chegada < b.chegada) {
					return 1;
				}
				if (a.chegada > b.chegada) {
					return -1;
				}
			} else if (type == 3) {
				if (a.deadLine > b.deadLine) {
					return 1;
				}
				if (a.deadLine < b.deadLine) {
					return -1;
				}
			} else if (type == 4) {
				if (a.tempo > b.tempo) {
					return 1;
				}
				if (a.tempo < b.tempo) {
					return -1;
				}
			}
			return 0;
		});
		return array;
	}

}

// pablo se n entender, me chama.