function gerarRodizio() {
    const mes = document.getElementById("mesSelecionado").value;
    if (!mes) return alert("Selecione um mês!");

    const [ano, mesNum] = mes.split("-").map(Number);
    const mesIndex = mesNum - 1;

    // Recebe operadores
    const cultoOps = lista("opCulto");
    const reuniaoOps = lista("opReuniao");
    const ensaioOps = lista("opEnsaio");
    const cultoJovemOps = lista("opCultoJovem");

    // Atualiza títulos
    document.getElementById("mesNome").innerText = nomeMes(mesIndex);
    document.getElementById("anoSelecionado").innerText = ano;

    // Gera tabelas
    gerarTabelaCulto(ano, mesIndex, cultoOps);                // Dom, Ter, Qui
    gerarTabelaReuniao(ano, mesIndex, reuniaoOps);            // Todo domingo
    gerarTabelaSegundo(ano, mesIndex, 5, ensaioOps, "tabelaEnsaio");      // 2ª sexta
    gerarTabelaSegundo(ano, mesIndex, 6, cultoJovemOps, "tabelaCultoJovem"); // 2º sábado
}

function lista(id) {
    return document.getElementById(id).value
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
}

function gerarTabelaCulto(ano, mes, ops) {
    const t = document.getElementById("tabelaCulto");
    t.innerHTML = "<tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>";

    const dias = [0, 2, 4]; // domingo, terça e quinta
    let i = 0;

    for (let d = 1; d <= diasMes(ano, mes); d++) {
        const data = new Date(ano, mes, d);
        if (dias.includes(data.getDay())) {
            t.innerHTML += linha(data, ops[i % ops.length]);
            i++;
        }
    }
}

// Reunião de jovens: todo domingo de manhã
function gerarTabelaReuniao(ano, mes, ops) {
    const t = document.getElementById("tabelaReuniao");
    t.innerHTML = "<tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>";

    let i = 0;

    for (let d = 1; d <= diasMes(ano, mes); d++) {
        const data = new Date(ano, mes, d);
        if (data.getDay() === 0) { // domingo
            t.innerHTML += linha(data, ops[i % ops.length]);
            i++;
        }
    }
}

// Função para pegar o 2º sábado, 2ª sexta etc
function gerarTabelaSegundo(ano, mes, diaSemana, ops, tabelaId) {
    const t = document.getElementById(tabelaId);
    t.innerHTML = "<tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>";

    let contador = 0;
    let i = 0;

    for (let d = 1; d <= diasMes(ano, mes); d++) {
        const data = new Date(ano, mes, d);
        if (data.getDay() === diaSemana) {
            contador++;
            if (contador === 2) { 
                t.innerHTML += linha(data, ops[i % ops.length]);
                return;
            }
        }
    }
}

function linha(data, operador) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");

    return `
        <tr>
            <td>${diaNome(data.getDay())}</td>
            <td>${dia}/${mes}</td>
            <td>${operador}</td>
        </tr>`;
}

function diaNome(d) {
    return ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"][d];
}

function nomeMes(m) {
    return [
        "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
        "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ][m];
}

function diasMes(ano, mes) {
    return new Date(ano, mes + 1, 0).getDate();
}
