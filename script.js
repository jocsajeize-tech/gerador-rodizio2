// Retorna nome do mês
function nomeMes(num) {
    const meses = [
        "JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO",
        "JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"
    ];
    return meses[num];
}

// Função principal
function gerarRodizio() {

    // Limpar tabelas
    limparTabela("tabelaCulto");
    limparTabela("tabelaReuniao");
    limparTabela("tabelaEnsaio");
    limparTabela("tabelaCultoJovem");

    // Pegar mês
    const inputMes = document.getElementById("mesSelecionado").value;
    if (!inputMes) {
        alert("Selecione um mês!");
        return;
    }

    const ano = parseInt(inputMes.split("-")[0]);
    const mes = parseInt(inputMes.split("-")[1]) - 1;

    document.getElementById("mesNome").innerText = nomeMes(mes);
    document.getElementById("anoSelecionado").innerText = ano;

    // Operadores
    const opsCulto = pegarLista("opCulto");
    const opsReuniao = pegarLista("opReuniao");
    const opsEnsaio = pegarLista("opEnsaio");
    const opsCultoJovem = pegarLista("opCultoJovem");

    // Rodízio: contador
    let idxCulto = 0;
    let idxReuniao = 0;
    let idxEnsaio = 0;
    let idxCultoJovem = 0;

    // Descobrir 2ª sexta
    let segundaSexta = null;
    // Descobrir 2º sábado
    let segundoSabado = null;

    let sextaCount = 0;
    let sabadoCount = 0;

    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const data = new Date(ano, mes, dia);
        const semana = data.getDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab

        // Identificar 2ª Sexta
        if (semana === 5) {
            sextaCount++;
            if (sextaCount === 2) segundaSexta = dia;
        }

        // Identificar 2º Sábado
        if (semana === 6) {
            sabadoCount++;
            if (sabadoCount === 2) segundoSabado = dia;
        }
    }

    // Montar tabelas
    for (let dia = 1; dia <= ultimoDia; dia++) {

        const data = new Date(ano, mes, dia);
        const semana = data.getDay();

        const diaStr = data.toLocaleDateString("pt-BR");

        // CULTO – Domingo noite, Terça, Quinta
        if (semana === 0 || semana === 2 || semana === 4) {
            adicionarLinha("tabelaCulto",
                nomeDia(semana),
                diaStr,
                opsCulto[idxCulto % opsCulto.length]
            );
            idxCulto++;
        }

        // REUNIÃO DE JOVENS – Domingo de manhã
        if (semana === 0) {
            adicionarLinha("tabelaReuniao",
                "DOMINGO (MANHÃ)",
                diaStr,
                opsReuniao[idxReuniao % opsReuniao.length]
            );
            idxReuniao++;
        }

        // ENSAIO – 2ª Sexta
        if (dia === segundaSexta) {
            adicionarLinha("tabelaEnsaio",
                "2ª SEXTA",
                diaStr,
                opsEnsaio[idxEnsaio % opsEnsaio.length]
            );
            idxEnsaio++;
        }

        // CULTO DE JOVENS – 2º Sábado
        if (dia === segundoSabado) {
            adicionarLinha("tabelaCultoJovem",
                "2º SÁBADO",
                diaStr,
                opsCultoJovem[idxCultoJovem % opsCultoJovem.length]
            );
            idxCultoJovem++;
        }

    }

}


// Utilidades -----------------------------

function limparTabela(id) {
    const tabela = document.getElementById(id);
    tabela.innerHTML = `
        <tr>
            <th>DIA</th>
            <th>DATA</th>
            <th>IRMÃO</th>
        </tr>
    `;
}

function adicionarLinha(id, dia, data, operador) {
    const tabela = document.getElementById(id);
    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>${dia}</td>
        <td>${data}</td>
        <td>${operador}</td>
    `;

    tabela.appendChild(linha);
}

function pegarLista(id) {
    return document.getElementById(id).value
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
}

function nomeDia(d) {
    return ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"][d];
}
