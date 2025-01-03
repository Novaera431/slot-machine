document.addEventListener('DOMContentLoaded', () => {
    iniciarSlotsAleatorios();  // Exibe frutas aleatórias ao carregar a página
});

document.getElementById('cupom-form').onsubmit = async function(event) {
    event.preventDefault();
    
    const cupom = document.getElementById('cupom').value;
    const valor = document.getElementById('valor').value;
    const slots = document.querySelectorAll('.slot');

    if (!cupom || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    const frutas = Array.from(slots).map(slot => slot.innerText);

    // Iniciar a rotação visual dos slots
    iniciarRotacao(slots);

    // Sorteio antecipado das frutas
    const frutasSorteadas = [
        sortearFruta(),
        sortearFruta(),
        sortearFruta()
    ];

    // Parar os slots em tempos diferentes
    pararSlot(slots[0], frutasSorteadas[0], 2000);
    pararSlot(slots[1], frutasSorteadas[1], 3000);
    pararSlot(slots[2], frutasSorteadas[2], 4000);

    // Enviar jogada ao backend após o último slot parar
    setTimeout(async () => {
        const response = await fetch('https://slot-machine-backend.onrender.com/api/jogar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cupom: cupom,
                valor: valor,
                frutas: frutasSorteadas
            })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.error || 'Erro ao registrar a jogada.');
        }
    }, 4500);  // Aguarda todos os slots pararem
};

// Exibe frutas aleatórias ao carregar a página
function iniciarSlotsAleatorios() {
    const frutas = criarListaPonderada();
    const slots = document.querySelectorAll('.slot');

    slots.forEach(slot => {
        const frutaAleatoria = sortearFruta();
        slot.innerHTML = `<div>${frutaAleatoria}</div>`;
    });
}

// Lista ponderada de frutas (probabilidade ajustada)
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

// Adiciona frutas na lista de forma ponderada
function adicionarFruta(lista, fruta, quantidade) {
    for (let i = 0; i < quantidade; i++) {
        lista.push(fruta);
    }
}

// Inicia a rotação visual dos slots
function iniciarRotacao(slots) {
    slots.forEach(slot => {
        slot.innerHTML = '';  // Limpa o slot para iniciar rotação

        for (let i = 0; i < 20; i++) {
            const fruta = sortearFruta();
            const div = document.createElement('div');
            div.innerText = fruta;
            slot.appendChild(div);
        }
        slot.style.animation = 'spin 0.3s linear infinite';
    });
}

// Para o slot e exibe a fruta sorteada
function pararSlot(slot, frutaSorteada, tempo) {
    setTimeout(() => {
        slot.style.animation = 'none';
        slot.innerHTML = `<div>${frutaSorteada}</div>`;
    }, tempo);
}

// Sorteia uma fruta com base na lista ponderada
function sortearFruta() {
    const frutas = criarListaPonderada();
    const index = Math.floor(Math.random() * frutas.length);
    return frutas[index];
}
