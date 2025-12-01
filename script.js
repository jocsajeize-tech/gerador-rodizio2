document.getElementById("generate").addEventListener("click", generateCalendar);

function generateCalendar() {
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);

    const dates = getAllDates(year, month);
    const rodizioNomes = ["Abimael", "Daniel", "Fábio", "Jonatas"];
    let indexRodizio = 0;

    const tbody = document.querySelector("#calendarTable tbody");
    tbody.innerHTML = "";

    dates.forEach(d => {
        const dayOfWeek = d.getDay(); // 0-dom,1-seg,2-ter...

        let atividades = [];

        // ====== REUNIÃO DE JOVENS - TODO DOMINGO (MANHÃ) ======
        if (dayOfWeek === 0) {
            atividades.push("Reunião de Jovens");
        }

        // ====== CULTOS ======
        // Domingo (noite)
        if (dayOfWeek === 0) {
            atividades.push("Culto");
        }
        // Terça
        if (dayOfWeek === 2) {
            atividades.push("Culto");
        }
        // Quinta
        if (dayOfWeek === 4) {
            atividades.push("Culto");
        }

        // ====== ENSAIO 2 — segunda sexta-feira ======
        if (dayOfWeek === 5 && isSecondWeekdayOfMonth(d, 5)) {
            atividades.push("Ensaio 2");
        }

        // ====== CULTO DE JOVENS — segundo sábado ======
        if (dayOfWeek === 6 && isSecondWeekdayOfMonth(d, 6)) {
            atividades.push("Culto de Jovens");
        }

        // Se não há nenhuma atividade, pula o dia
        if (atividades.length === 0) return;

        // Cria a linha
        const tr = document.createElement("tr");

        // Data
        const tdData = document.createElement("td");
        tdData.textContent = formatDate(d);
        tr.appendChild(tdData);

        // Atividades
        const tdAtividade = document.createElement("td");
        tdAtividade.textContent = atividades.join(", ");
        tr.appendChild(tdAtividade);

        // Rodízio
        const tdIrmao = document.createElement("td");
        tdIrmao.textContent = rodizioNomes[indexRodizio];
        indexRodizio = (indexRodizio + 1) % rodizioNomes.length;
        tr.appendChild(tdIrmao);

        tbody.appendChild(tr);
    });
}

// ======= FUNÇÕES DE APOIO =======

// Lista todas as datas do mês
function getAllDates(year, month) {
    const dates = [];
    const date = new Date(year, month - 1, 1);
    while (date.getMonth() === month - 1) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}

// Retorna "DD/MM/YYYY"
function formatDate(d) {
    return d.toLocaleDateString("pt-BR");
}

// Verifica se é o 2º sábado, 2ª sexta, etc.
function isSecondWeekdayOfMonth(date, weekday) {
    const day = date.getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    // Conta quantos weekdays já passaram
    let count = 0;
    for (let d = 1; d <= day; d++) {
        const temp = new Date(date.getFullYear(), date.getMonth(), d);
        if (temp.getDay() === weekday) count++;
    }

    return count === 2;
}
