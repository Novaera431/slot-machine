document.getElementById('cupom-form').onsubmit = async function(event) {
    event.preventDefault();
    
    const cupom = document.getElementById('cupom').value;
    const valor = document.getElementById('valor').value;
    const resultadoDiv = document.getElementById('resultado');
    const slots = document.querySelectorAll('.slot');

    if (!cupom || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    // Criação da lista ponderada de frutas
    const frutas = criarListaPonderada();
    
    // Sorteio antecipado das frutas
    const sorteio = [
        sortearFruta(frutas),
        sortearFruta(frutas),
        sortearFruta(frutas)
    ];

    // Iniciar animação nos slots
    slots.forEach(slot => {
        slot.innerHTML = frutas.map(f => `<div>${f}</div>`).join('');
        slot.style.animation = 'spin 0.1s linear infinite';
    });

    // Parar os slots em tempos diferentes e mostrar o sorteio
    pararSlot(slots[0], sorteio[0], 2000);
    pararSlot(slots[1], sorteio[1], 3000);
    pararSlot(slots[2], sorteio[2], 4000);
};

// Criação da lista ponderada de frutas
function criarListaPonderada() {
    const frutas = [];
    adicionarFruta(frutas, "🍇", 1);  // Uva
    adicionarFruta(frutas, "🍉", 2);  // Melancia
    adicionarFruta(frutas, "🍒", 3);  // Cereja
    adicionarFruta(frutas, "🍍", 4);  // Abacaxi
    adicionarFruta(frutas, "🍓", 5);  // Morango
    adicionarFruta(frutas, "🍋", 6);  // Limão
    adicionarFruta(frutas, "🍈", 7);  // Melão
    adicionarFruta(frutas, "🥝", 8);  // Kiwi
    return frutas;
}

// Adiciona frutas à lista ponderada
function adicionarFruta(lista, fruta, quantidade) {
    for (let i = 0; i < quantidade; i++) {
        lista.push(fruta);
    }
}

// Sorteio antecipado com base na lista ponderada
function sortearFruta(lista) {
    const index = Math.floor(Math.random() * lista.length);
    return lista[index];
}

// Função para parar slot e mostrar o resultado do sorteio
function pararSlot(slot, frutaSorteada, tempo) {
    setTimeout(() => {
        slot.style.animation = 'none';
        slot.innerHTML = `<div>${frutaSorteada}</div>`;
        verificarResultado();
    }, tempo);
}

// Verifica se houve prêmio e exibe mensagem
function verificarResultado() {
    const slots = document.querySelectorAll('.slot div');
    const frutasSorteadas = Array.from(slots).map(slot => slot.innerText);

    if (frutasSorteadas.every((fruta, _, arr) => fruta === arr[0])) {
        const premio = calcularPremio(frutasSorteadas[0]);
        alert(`Parabéns! Você ganhou R$${premio}!`);
    } else {
        alert("Infelizmente você não ganhou desta vez.");
    }
}

// Calcula o prêmio com base na fruta sorteada
function calcularPremio(fruta) {
    const premios = {
        "🍇": 1000,
        "🍉": 500,
        "🍒": 300,
        "🍍": 200,
        "🍓": 100,
        "🍋": 50,
        "🍈": 20,
        "🥝": 10
    };
    return premios[fruta] || 0;
}
