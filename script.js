document.addEventListener('DOMContentLoaded', () => {
    iniciarSlotsAleatorios();  // Exibe frutas aleatórias ao carregar a página
});

document.getElementById('cupom-form').onsubmit = function(event) {
    event.preventDefault();
    
    const cupom = document.getElementById('cupom').value;
    const valor = document.getElementById('valor').value;
    const slots = document.querySelectorAll('.slot');

    if (!cupom || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    const frutas = criarListaPonderada();
    
    // Sorteio antecipado das frutas
    const sorteio = [
        sortearFruta(frutas),
        sortearFruta(frutas),
        sortearFruta(frutas)
    ];

    // Reinicia os slots
    slotsParados = 0;

    // Iniciar rotação
    slots.forEach(slot => {
        iniciarRotacao(slot, frutas);
    });

    // Parar os slots em tempos diferentes
    slots.forEach((slot, index) => {
        pararSlot(slot, sorteio[index], 2000 + (index * 1000));
    });
};

// Exibe frutas aleatórias ao carregar
function iniciarSlotsAleatorios() {
    const frutas = criarListaPonderada();
    const slots = document.querySelectorAll('.slot');

    slots.forEach(slot => {
        const frutaAleatoria = sortearFruta(frutas);
        slot.innerHTML = `<div>${frutaAleatoria}</div>`;
    });
}

// Cria lista ponderada de frutas
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

// Adiciona frutas de forma ponderada
function adicionarFruta(lista, fruta, quantidade) {
    for (let i = 0; i < quantidade; i++) {
        lista.push(fruta);
    }
}

// Inicia rotação dos slots
function iniciarRotacao(slot, frutas) {
    slot.innerHTML = '';

    for (let i = 0; i < 20; i++) {
        const fruta = frutas[Math.floor(Math.random() * frutas.length)];
        const div = document.createElement('div');
        div.innerText = fruta;
        slot.appendChild(div);
    }

    slot.style.animation = 'spin 0.3s linear infinite';
}

// Para o slot com a fruta sorteada
function pararSlot(slot, frutaSorteada, tempo) {
    setTimeout(() => {
        slot.style.animation = 'none';
        slot.innerHTML = `<div>${frutaSorteada}</div>`;
    }, tempo);
}

// Sorteia uma fruta com base na lista ponderada
function sortearFruta(lista) {
    const index = Math.floor(Math.random() * lista.length);
    return lista[index];
}
