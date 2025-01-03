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

    // Resetando o estado dos slots
    resultadoDiv.innerText = "";

    // Iniciar animação nos slots
    slots.forEach(slot => {
        iniciarRotacao(slot, frutas);
    });

    // Parar os slots em tempos diferentes e mostrar o sorteio
    let slotsParados = 0;

    pararSlot(slots[0], sorteio[0], 2000);
    pararSlot(slots[1], sorteio[1], 3000);
    pararSlot(slots[2], sorteio[2], 4000, true);  // O último slot dispara o resultado
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

function adicionarFruta(lista, fruta, quantidade) {
    for (let i = 0; i < quantidade; i++) {
        lista.push(fruta);
    }
}

// Inicia a rotação visual das frutas
function iniciarRotacao(slot, frutas) {
    slot.innerHTML = '';

    for (let i = 0; i < 20; i++) {
        const fruta = frutas[Math.floor(Math.random() * frutas.length)];
        const div = document.createElement('div');
        div.innerText = fruta;
        slot.appendChild(div);
    }

    // Ajuste na velocidade de rotação
    slot.style.animation = 'spin 0.3s linear infinite';
}

// Para o slot e exibe a fruta sorteada
function pararSlot(slot, frutaSorteada, tempo, ultimo = false) {
    setTimeout(() => {
        slot.style.animation = 'none';

        slot.innerHTML = `<div>${frutaSorteada}</div>`;
        if (ultimo) {
            verificarResultado();
        }
    }, tempo);
}

// Verifica se houve prêmio e exibe mensagem uma vez
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
