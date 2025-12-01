function gerarRodizio() {
    const nomesTexto = document.getElementById("nomes").value.trim();
    if (!nomesTexto) {
        alert("Digite ao menos um nome!");
        return;
    }

    const nomes = nomesTexto.split("\n").map(n => n.trim()).filter(n => n !== "");
    const dias = [
        "Domingo", "Terça-feira", "Quinta-feira",
        "Domingo", "Terça-feira", "Quinta-feira",
        "Domingo", "Terça-feira", "Quinta-feira",
        "Domingo", "Terça-feira", "Quinta-feira"
    ];

    let resultado = "";
    let index = 0;

    for (let i = 0; i < dias.length; i++) {
        const nome = nomes[index];
        resultado += `${dias[i]} — ${nome}\n`;
        index = (index + 1) % nomes.length;
    }

    document.getElementById("resultado").textContent = resultado;
}
