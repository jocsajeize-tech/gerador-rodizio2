// Função para obter todas as datas de um dia específico no mês
function getDatesForDay(dayOfWeek, month, year) {
    const dates = [];
    let date = new Date(year, month, 1);

    // Avança até chegar no dia da semana correto
    while (date.getDay() !== dayOfWeek) {
        date.setDate(date.getDate() + 1);
    }

    // Vai pegando todas as datas desse dia no mês
    while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 7);
    }

    return dates;
}

// Formata tipo "2-nov."
function formatDate(d) {
    const dia = d.getDate();
    const meses = ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."];
    return `${dia}-${meses[d.getMonth()]}`;
}

// Aplica rodízio de nomes
function distribuir(dates, nomes, startIndex) {
    const result = [];
    let idx = startIndex;

    for (let i = 0; i < dates.length; i++) {
        result.push({
            data: dates[i],
            nome: nomes[idx]
        });

        idx = (idx + 1) % nomes.length; // continua o rodízio
    }

    return { dados: result, nextIndex: idx };
}

// Limpa tabela
function limparTabela(id) {
    document.querySelector(id + " tbody").innerHTML = "";
}

// Preenche tabela
function preencherTabela(id, lista) {
    const tbody = document.querySelector(id + " tbody");

    lista.forEach(item => {
        const tr = document.createElement("tr");

        const tdData = document.createElement("td");
        tdData.textContent = formatDate(item.data);

        const tdNome = document.createElement("td");
        tdNome.textContent = item.nome;

        tr.appendChild(tdData);
        tr.appendChild(tdNome);

        tbody.appendChild(tr);
    });
}

// Função principal
function gerar() {
    const mes = parseInt(document.getElementById("mes").value);
    const ano = parseInt(document.getElementById("ano").value);

    let nomes = document.getElementById("names").value
        .split("\n")
        .map(n => n.trim())
        .filter(n => n.length > 0);

    if (nomes.length === 0) {
        alert("Digite pelo menos 1 nome!");
        return;
    }

    // Dias da semana:
    // Domingo=0, Segunda=1, Terça=2, Quarta=3, Quinta=4, Sexta=5, Sábado=6
    const datasDomingo = getDatesForDay(0, mes, ano);
    const datasTerca = getDatesForDay(2, mes, ano);
    const datasQuinta = getDatesForDay(4, mes, ano);

    // Limpar tabelas
    limparTabela("#tblCultos");
    limparTabela("#tblJovens");
    limparTabela("#tblEnsaio");
    limparTabela("#tblCultoJovens");

    // Rodízio global
    let startIndex = 0;

    // CULTO (Domingos)
    let culto = distribuir(datasDomingo, nomes, startIndex);
    preencherTabela("#tblCultos", culto.dados);
    startIndex = culto.nextIndex;

    // REUNIÃO DE JOVENS (Terças)
    let jovens = distribuir(datasTerca, nomes, startIndex);
    preencherTabela("#tblJovens", jovens.dados);
    startIndex = jovens.nextIndex;

    // ENSAIO (Quintas)
    let ensaio = distribuir(datasQuinta, nomes, startIndex);
    preencherTabela("#tblEnsaio", ensaio.dados);
    startIndex = ensaio.nextIndex;

    // CULTO DE JOVENS (Domingos novamente)
    let cultoJovens = distribuir(datasDomingo, nomes, startIndex);
    preencherTabela("#tblCultoJovens", cultoJovens.dados);
}
