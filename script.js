document.getElementById('cupom-form').onsubmit = async function(event) {
    event.preventDefault();
    
    const cupom = document.getElementById('cupom').value;
    const resultadoDiv = document.getElementById('resultado');
    const slots = document.querySelectorAll('.slot');
    const frutas = ['🍒', '🍍', '🍉', '🍇', '🍓'];

    resultadoDiv.innerText = "Rodando...";

    const spinSound = new Audio('spin.mp3');
    const stopSound = new Audio('stop.mp3');

    spinSound.loop = true;
    spinSound.play();

    // Aleatorizar a ordem inicial das frutas em cada slot
    slots.forEach(slot => {
        const randomIndex = Math.floor(Math.random() * frutas.length);
        const slotItems = slot.querySelectorAll('div');
        
        // Reorganiza as frutas no slot
        slotItems.forEach((item, index) => {
            item.innerText = frutas[(randomIndex + index) % frutas.length];
        });

        // Reiniciar a rotação
        slot.style.animation = 'spin-sequence 0.2s linear infinite';
    });

    // Função para parar o slot em tempos aleatórios
    function pararSlot(slot, tempoBase) {
        const tempoAleatorio = tempoBase + Math.floor(Math.random() * 500);  // Variação de até 500ms
        setTimeout(() => {
            slot.style.animation = 'none';  // Parar a animação
            const slotItems = slot.querySelectorAll('div');
            const randomIndex = Math.floor(Math.random() * frutas.length);
            slotItems[randomIndex].scrollIntoView({ behavior: 'smooth' });
            stopSound.play();
        }, tempoAleatorio);
    }

    // Parar os slots com variação aleatória de tempo
    pararSlot(slots[0], 2000);  // Primeiro slot com base de 2 segundos
    pararSlot(slots[1], 2500);  // Segundo com base de 2.5 segundos
    pararSlot(slots[2], 3000);  // Terceiro com base de 3 segundos

    // Parar o som de rotação quando o último slot parar
    setTimeout(() => {
        spinSound.pause();
        spinSound.currentTime = 0;

        // Enviar cupom ao backend
        fetch('https://slot-machine-backend.onrender.com/api/jogar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cupom })
        })
        .then(response => response.json())
        .then(data => {
            resultadoDiv.innerText = data.message;
        });
    }, 3500);
};
