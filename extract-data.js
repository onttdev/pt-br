const fs = require('fs');
const LENGTH = 5;
const SCORE_THRESHOLD = 0.5; // [0, 1]
const FREQUENCY_THRESHOLD = 100;

// Função para calcular a pontuação das palavras
function calculateScore({ tf, dicts, corpus, title }) {
	// Pesos atribuídos a cada fator
	const dictsWeight = 0.7;     // Peso de quantos dicionários a palavra aparece
	const corpusWeight = 0.1;    // Peso da frequência no corpus geral
	const titleWeight = 0.2;    // Peso maior se a palavra está no título

	// Aplicando os pesos para calcular a pontuação
	return (dicts * dictsWeight) + (corpus * corpusWeight) + (title * titleWeight);
}

// Função para executar o código com os arquivos especificados
function run() {
	console.log('Iniciando leitura e filtragem de dados...');

	const fileContent = fs.readFileSync('data', 'utf-8');
	const lines = fileContent.split('\n');

	// Filtrar palavras com tamanho definido e calcular a pontuação de comunalidade
	const words = lines
		.filter((line, index) => index > 0 && line.split(',')[0].length === LENGTH) // Palavras do tamanho especificado
		.map(line => {
			const [word, tf, dicts, corpus, title] = line.split(',');
			const data = {
				tf: Number(tf),
				dicts: Number(dicts),
				corpus: Number(corpus),
				title: Number(title),
			}

			return {
				word,
				frequency: Number(tf),
				score: calculateScore(data),
				// data,
			}
		})
		.filter(e => e.score >= SCORE_THRESHOLD && e.frequency >= FREQUENCY_THRESHOLD)
		.sort((a, b) => b.score - a.score);

	// Grava as palavras comuns com pontuação em um arquivo JSON
	fs.writeFileSync(`./out/data.json`, JSON.stringify(words.sort((a, b) => b.frequency - a.frequency), null, 2));
	console.log('Concluído! Arquivo gerado em ./out/data.json');
}

// Executa o código
run();
