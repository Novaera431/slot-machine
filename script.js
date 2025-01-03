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

    const frutas = criarListaPonderada();
    const sorteio = [sortearFruta(frutas), sortearFruta(frutas), sortearFruta(frutas)];

    // Exibe as frutas nos slots
    slots.forEach((slot, index) => {
        slot.innerText = sorteio[index];
    });

    // Verifica se há prêmios
    const premio = calcularPremio(sorteio);

    // Exibe popup com o resultado
    setTimeout(() => {
        if (premio > 0) {
            alert(`Parabéns! Você ganhou R$${premio.toFixed(2)}!`);
        } else {
            alert("Infelizmente você não ganhou desta vez. Tente novamente!");
        }
    }, 500);
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

// Adiciona frutas à lista proporcionalmente
function adicionarFruta(lista, fruta, quantidade) {
    for (let i = 0; i < quantidade; i++) {
        lista.push(fruta);
    }
}

// Sorteio ponderado de frutas
function sortearFruta(lista) {
    const index = Math.floor(Math.random() * lista.length);
    return lista[index];
}

// Calcula o prêmio com base no sorteio
function calcularPremio(sorteio) {
    const [slot1, slot2, slot3] = sorteio;
    if (slot1 === slot2 && slot2 === slot3) {
        switch (slot1) {
            case "🍇": return 1000;
            case "🍉": return 500;
            case "🍒": return 300;
            case "🍍": return 200;
            case "🍓": return 100;
            case "🍋": return 50;
            case "🍈": return 20;
            case "🥝": return 10;
            default: return 0;
        }
    }
    return 0;  // Sem prêmio se as frutas forem diferentes
}
