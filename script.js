document.getElementById("saveRodizios").addEventListener("click", saveRodizios);
document.getElementById("generate").addEventListener("click", generateCalendar);

/* --------------------------
    SALVAR RODÍZIOS
--------------------------- */
function saveRodizios() {
    localStorage.setItem("rod_jovens", document.getElementById("rod_jovens").value);
    localStorage.setItem("rod_culto", document.getElementById("rod_culto").value);
    localStorage.setItem("rod_ensaio", document.getElementById("rod_ensaio").value);
    localStorage.setItem("rod_culto_jovens", document.getElementById("rod_culto_jovens").value);
    alert("Rodízios salvos!");
}

/* --------------------------
    CARREGA RODÍZIOS NO INÍCIO
--------------------------- */
window.onload = function () {
    document.getElementById("rod_jovens").value = localStorage.getItem("rod_jovens") || "";
    document.getElementById("rod_culto").value = localStorage.getItem("rod_culto") || "";
    document.getElementById("rod_ensaio").value = localStorage.getItem("rod_ensaio") || "";
    document.getElementById("rod_culto_jovens").value = localStorage.getItem("rod_culto_jovens") || "";
};

/* --------------------------
    GERA O CALENDÁRIO
--------------------------- */
function generateCalendar() {
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);

    const rodJovens = readRodizio("rod_jovens");
    const rodCulto = readRodizio("rod_culto");
    const rodEnsaio = readRodizio("rod_ensaio");
    const rodCultoJovens = readRodizio("rod_culto_jovens");

    let idxJovens = 0, idxCulto = 0, idxEnsaio = 0, idxCultoJovens = 0;

    const tbody = document.querySelector("#calendarTable tbody");
    tbody.innerHTML = "";

    const dates = getAllDates(year, month);

    dates.forEach(date => {
        const dow = date.getDay(); // dia da semana

        /* ---------------- DOMINGO ---------------- */
        if (dow === 0) {
            // Reunião de jovens (manhã)
            addRow(date, "Reunião de Jovens", rodJovens[idxJovens]);
            idxJovens = (idxJovens + 1) % rodJovens.length;

            // Culto (noite)
            addRow(date, "Culto", rodCulto[idxCulto]);
            idxCulto = (idxCulto + 1) % rodCulto.length;
        }

        /* ---------------- TERÇA ---------------- */
        if (dow === 2) {
            addRow(date, "Culto", rodCulto[idxCulto]);
            idxCulto = (idxCulto + 1) % rodCulto.length;
        }

        /* ---------------- QUINTA ---------------- */
        if (dow === 4) {
            addRow(date, "Culto", rodCulto[idxCulto]);
            idxCulto = (idxCulto + 1) % rodCulto.length;
        }

        /* ---------------- 2ª SEXTA ---------------- */
        if (dow === 5 && isSecond(date, 5)) {
            addRow(date, "Ensaio 2", rodEnsaio[idxEnsaio]);
            idxEnsaio = (idxEnsaio + 1) % rodEnsaio.length;
        }

        /* ---------------- 2º SÁBADO ---------------- */
        if (dow === 6 && isSecond(date, 6)) {
            addRow(date, "Culto de Jovens", rodCultoJovens[idxCultoJovens]);
            idxCultoJovens = (idxCultoJovens + 1) % rodCultoJovens.length;
        }
    });
}

/* --------------------------
    FUNÇÕES DE APOIO
--------------------------- */

// Lê um rodízio (uma pessoa por linha)
function readRodizio(id) {
    return document.getElementById(id)
        .value.split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);
}

// Insere linha na tabela
function addRow(date, atividade, responsavel) {
    const tbody = document.querySelector("#calendarTable tbody");
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${format(date)}</td>
        <td>${atividade}</td>
        <td>${responsavel}</td>
    `;

    tbody.appendChild(tr);
}

// Formata data DD/MM/YYYY
function format(d) {
    return d.toLocaleDateString("pt-BR");
}

// Lista todas as datas do mês
function getAllDates(year, month) {
    const list = [];
    const date = new Date(year, month - 1, 1);

    while (date.getMonth() === month - 1) {
        list.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return list;
}

// Verifica se é a 2ª sexta ou 2º sábado
function isSecond(date, weekday) {
    let count = 0;
    for (let d = 1; d <= date.getDate(); d++) {
        const t = new Date(date.getFullYear(), date.getMonth(), d);
        if (t.getDay() === weekday) count++;
    }
    return count === 2;
}
