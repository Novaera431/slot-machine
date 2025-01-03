document.addEventListener('DOMContentLoaded', () => {
    iniciarSlotsAleatorios();  // Exibe frutas aleatórias ao carregar a página
});

document.getElementById('cupom-form').onsubmit = async function(event) {
    event.preventDefault();
    
    const cupom = document.getElementById('cupom').value;
    const valor = document.getElementById('valor').value;
    const slots = document.querySelectorAll('.slot');
    const resultadoDiv = document.getElementById('resultado');
    const botaoJogar = document.getElementById('botao-jogar');

    if (!cupom || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    // Desabilita o botão enquanto os slots giram
    botaoJogar.disabled = true;
    resultadoDiv.innerText = '';  // Limpa o resultado anterior

    try {
        // Verifica se o cupom já foi usado antes de girar os slots
        const verificaCupom = await fetch('https://slot-machine-backend.onrender.com/api/verificar-cupom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cupom: cupom
            })
        });

        const resultado = await verificaCupom.json();
        if (!verificaCupom.ok) {
            alert(resultado.error || 'Erro ao verificar o cupom.');
            botaoJogar.disabled = false;
            return;
        }

        // Iniciar a rotação visual dos slots após verificar o cupom
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

        // Envia jogada ao backend após o último slot parar
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
            botaoJogar.disabled = false;  // Habilita o botão após a jogada

            if (response.ok) {
                const premio = verificarPremio(frutasSorteadas);
                if (premio > 0) {
                    resultadoDiv.innerText = `🎉 Parabéns! Você ganhou um cupom de R$${premio},00 com ${frutasSorteadas[0]}!`;
                } else {
                    resultadoDiv.innerText = "😔 Infelizmente você não ganhou desta vez.";
                }
            } else {
                alert(data.error || 'Erro ao registrar a jogada.');
            }
        }, 4500);
        
    } catch (error) {
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        botaoJogar.disabled = false;
    }
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

// Sorteia uma fruta com base na lista ponderada
function sortearFruta() {
    const frutas = criarListaPonderada();
    const index = Math.floor(Math.random() * frutas.length);
    return frutas[index];
}

// Inicia a rotação visual dos slots
function iniciarRotacao(slots) {
    slots.forEach(slot => {
        slot.innerHTML = '';

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

// Verifica se o jogador ganhou e retorna o valor do prêmio
function verificarPremio(frutas) {
    if (frutas[0] === frutas[1] && frutas[1] === frutas[2]) {
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
        return premios[frutas[0]] || 0;
    }
    return 0;  // Se não houver frutas iguais, retorna 0 (nenhum prêmio)
}
