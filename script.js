// Novo script.js — corrige dias e faz rodízio contínuo cronológico

// Prioridade de tipos para ordenação no mesmo dia
const TYPE_PRIORITY = ['cultos','reuniaoJovens','ensaio','cultoJovens'];

// Mapas: tipo -> dias da semana (0=Dom,1=Seg,...,6=Sáb)
const TYPE_DAYS = {
  cultos: [0, 2, 4],          // domingo, terça, quinta
  reuniaoJovens: [0],         // domingo
  ensaio: [5],                // sexta-feira
  cultoJovens: [6]            // sábado
};

function formatDateShort(d){
  const dias = ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."];
  return `${d.getDate()}-${dias[d.getMonth()]}`;
}

function generateMonthDates(year, monthIndex){
  const dates = [];
  let d = new Date(year, monthIndex, 1);
  while (d.getMonth() === monthIndex){
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

// Cria lista de eventos (um item por evento — pode haver vários no mesmo dia)
function buildEventsForMonth(year, monthIndex){
  const dates = generateMonthDates(year, monthIndex);
  const events = [];
  dates.forEach(d => {
    const w = d.getDay(); // 0..6
    // para cada tipo, se o dia bate, adiciona evento
    Object.keys(TYPE_DAYS).forEach(type => {
      if (TYPE_DAYS[type].includes(w)) {
        events.push({
          type,
          date: new Date(d),
          weekday: w
        });
      }
    });
  });
  // Ordena por data; se mesmo dia, ordena por prioridade definida
  events.sort((a,b) => {
    if (a.date - b.date !== 0) return a.date - b.date;
    return TYPE_PRIORITY.indexOf(a.type) - TYPE_PRIORITY.indexOf(b.type);
  });
  return events;
}

// Particiona eventos por tipo para renderizar cada tabela (mantém ordem cronológica)
function partitionByType(assigned){
  const out = { cultos: [], reuniaoJovens: [], ensaio: [], cultoJovens: [] };
  assigned.forEach(e => {
    out[e.type].push(e);
  });
  return out;
}

function renderTable(id, rows){
  const tbody = document.querySelector(id + " tbody");
  tbody.innerHTML = "";
  rows.forEach(r=>{
    const tr = document.createElement("tr");
    const tdDate = document.createElement("td");
    tdDate.textContent = formatDateShort(new Date(r.date));
    const tdName = document.createElement("td");
    tdName.textContent = (r.participant || "").toUpperCase();
    tr.appendChild(tdDate);
    tr.appendChild(tdName);
    tbody.appendChild(tr);
  });
}

function readNames(){
  const raw = document.getElementById("names").value || "";
  return raw.split(/\r?\n/).map(s=>s.trim()).filter(s=>s.length>0);
}

function gerar(){
  const mesSelect = document.getElementById("mes");
  const anoInput = document.getElementById("ano");
  const monthIndex = parseInt(mesSelect.value,10); // 0-11
  const year = parseInt(anoInput.value,10);

  const nomes = readNames();
  if(nomes.length === 0){
    alert("Adicione pelo menos um nome na lista.");
    return;
  }

  // cria todos os eventos do mês (um por ocorrência de tipo)
  const events = buildEventsForMonth(year, monthIndex);

  // atribui participantes em sequência (rodízio contínuo)
  const assigned = [];
  let idx = 0;
  for(let i=0;i<events.length;i++){
    assigned.push(Object.assign({}, events[i], { participant: nomes[idx % nomes.length] }));
    idx++;
  }

  // particiona por tipo mantendo ordem cronológica e renderiza
  const parts = partitionByType(assigned);
  renderTable("#tblCultos", parts.cultos);
  renderTable("#tblJovens", parts.reuniaoJovens);
  renderTable("#tblEnsaio", parts.ensaio);
  renderTable("#tblCultoJovens", parts.cultoJovens);
}

// Inicializa selects e valores
(function init(){
  const mes = document.getElementById("mes");
  const now = new Date();
  mes.value = now.getMonth();
  const ano = document.getElementById("ano");
  ano.value = now.getFullYear();

  // botão gerar
  const btn = document.querySelector('button[onclick="gerar()"]');
  if(btn) btn.addEventListener('click', gerar);

  // gerar à carga
  gerar();
})();
