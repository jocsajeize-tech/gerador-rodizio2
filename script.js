function gerarRodizio() {

    const mesSelecionado = document.getElementById("mesSelecionado").value;
    if (!mesSelecionado) return alert("Selecione um mês!");

    const ano = Number(mesSelecionado.split("-")[0]);
    const mes = Number(mesSelecionado.split("-")[1]) - 1;

    const operadoresCulto = document.getElementById("opCulto").value.split(",").map(o => o.trim());
    const operadoresReuniao = document.getElementById("opReuniao").value.split(",").map(o => o.trim());
    const operadoresEnsaio = document.getElementById("opEnsaio").value.split(",").map(o => o.trim());
    const operadoresCultoJovem = document.getElementById("opCultoJovem").value.split(",").map(o => o.trim());

    gerarTabelaCulto(mes, ano, operadoresCulto);
    gerarTabelaSimples("tabelaReuniao", operadoresReuniao, "domingo", mes, ano);
    gerarTabelaSimples("tabelaEnsaio", operadoresEnsaio, "sexta-feira", mes, ano);
    gerarTabelaSimples("tabelaCultoJovem", operadoresCultoJovem, "sábado", mes, ano);
}

function gerarTabelaCulto(mes, ano, operadores) {
    const tabela = document.getElementById("tabelaCulto");
    tabela.innerHTML = "";

    tabela.innerHTML += `
        <tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>
    `;

    const diasCulto = [0, 2, 4]; // domingo terça quinta
    let opIndex = 0;

    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {

        const data = new Date(ano, mes, dia);
        const diaSemana = data.getDay();

        if (diasCulto.includes(diaSemana)) {
            tabela.innerHTML += `
                <tr>
                    <td>${nomeDia(diaSemana)}</td>
                    <td>${dia}/${mes + 1}</td>
                    <td>${operadores[opIndex % operadores.length]}</td>
                </tr>
            `;
            opIndex++;
        }
    }
}

function gerarTabelaSimples(idTabela, operadores, diaNome, mes, ano) {
    const tabela = document.getElementById(idTabela);
    tabela.innerHTML = "";

    tabela.innerHTML += `
        <tr><th>DIA</th><th>DATA</th><th>IRMÃO</th></tr>
    `;

    const mapping = {
        "domingo": 0,
        "segunda-feira": 1,
        "terça-feira": 2,
        "quarta-feira": 3,
        "quinta-feira": 4,
        "sexta-feira": 5,
        "sábado": 6
    };

    const diaSemana = mapping[diaNome];

    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    let opIndex = 0;

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes, dia);

        if (data.getDay() === diaSemana) {
            tabela.innerHTML += `
                <tr>
                    <td>${diaNome}</td>
                    <td>${dia}/${mes + 1}</td>
                    <td>${operadores[opIndex % operadores.length]}</td>
                </tr>
            `;
            opIndex++;
        }
    }
}

function nomeDia(n) {
    return ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"][n];
}
