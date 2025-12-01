function gerarRodizio() {

    const mes = document.getElementById("mesSelecionado").value;

    if (!mes) return alert("Selecione um mês!");

    const [ano, mesNum] = mes.split("-").map(Number);
    const mesIndex = mesNum - 1;

    const cultoOps = lista("opCulto");
    const reuniaoOps = lista("opReuniao");
    const ensaioOps = lista("opEnsaio");
    const cultoJovemOps = lista("opCultoJovem");

    gerarTabelaCulto(ano, mesIndex, cultoOps);
    gerarTabelaSemanal("tabelaReuniao", ano, mesIndex, 0, reuniaoOps); // domingo
    gerarTabelaSemanal("tabelaEnsaio", ano, mesIndex, 5, ensaioOps);   // sexta
    gerarTabelaSemanal("tabelaCultoJovem", ano, mesIndex, 6, cultoJovemOps); // sábado
}

function lista(id) {
    return document.getElementById(id).value.split(",").map(s => s.trim());
}

function gerarTabelaCulto(ano, mes, ops) {
    const t = document.getElementById("tabelaCulto");
    t.innerHTML = "<tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>";

    const dias = [0, 2, 4]; // dom, ter, qui

    let op = 0;
    const total = diasMes(ano, mes);

    for (let d = 1; d <= total; d++) {
        const data = new Date(ano, mes, d);
        if (dias.includes(data.getDay())) {
            t.innerHTML += linha(data, ops[op % ops.length]);
            op++;
        }
    }
}

function gerarTabelaSemanal(id, ano, mes, diaSemana, ops) {
    const t = document.getElementById(id);
    t.innerHTML = "<tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>";

    let op = 0;
    const total = diasMes(ano, mes);

    for (let d = 1; d <= total; d++) {
        const data = new Date(ano, mes, d);
        if (data.getDay() === diaSemana) {
            t.innerHTML += linha(data, ops[op % ops.length]);
            op++;
        }
    }
}

function linha(data, operador) {
    return `
        <tr>
            <td>${diaNome(data.getDay())}</td>
            <td>${data.getDate()}/${data.getMonth()+1}</td>
            <td>${operador}</td>
        </tr>`;
}

function diaNome(d) {
    return ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"][d];
}

function diasMes(ano, mes) {
    return new Date(ano, mes + 1, 0).getDate();
}
