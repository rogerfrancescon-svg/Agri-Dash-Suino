const fs = require('fs');
const buf = Buffer.from('Data;Nome Integrado;Lote;Idade;Animais Alojados;Recomendação;Mortalidade;Comedouro;Peso Aloj;Pontuação Sanitária;Colaborador;Consumo\n01/01/2023;Teste;1;10;1000;Ração X;0;Auto;30.5;Excelente;João;100', 'latin1');
const str = buf.toString('utf8');
console.log(str);
