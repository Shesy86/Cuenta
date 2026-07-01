let operations = [];
let initialResult = 0;
let result = 0;
let counter = 0;
let speed = 1500; // Tiempo calculado en milisegundos por defecto
let amount = 5; 
let topRange = 15; 
let timeoutId;

const soundCorrect = document.getElementById('soundCorrect');
const soundIncorrect = document.getElementById('soundIncorrect');

function updateSpeedLabel() {
    const level = parseInt(document.getElementById('speed').value);
    
    // Mostramos el nivel (1 al 5) en la interfaz
    document.getElementById('speedLabel').innerText = level;
    
    // Mapeo: Nivel alto (5) = menos milisegundos (más rápido)
    const speedMap = {
        1: 2500, // Muy lento
        2: 2000, // Lento
        3: 1500, // Normal
        4: 1000, // Rápido
        5: 500   // Súper rápido
    };
    
    speed = speedMap[level];
}

function updateAmountLabel() {
    amount = document.getElementById('amount').value;
    document.getElementById('amountLabel').innerText = amount;
}

function updateTopRangeLabel() {
    topRange = document.getElementById('topRange').value;
    document.getElementById('topRangeLabel').innerText = topRange;
}

function generateOperations() {
    operations = [];
    initialResult = Math.floor(Math.random() * topRange) + 1;
    result = initialResult;
    counter = 0;
    
    const opsDisplay = document.getElementById('operations');
    opsDisplay.innerText = result;

    // --- NUEVO: Reproducir el sonido bip con el primer número ---
    const bip = document.getElementById('sound');
    if (bip) { 
        bip.currentTime = 0; 
        bip.play().catch(() => {}); 
    }
    // -----------------------------------------------------------

    for (let i = 0; i < amount - 1; i++) {
        let number = Math.floor(Math.random() * topRange) + 1;
        let operation;
        if (result >= number) {
            operation = Math.random() < 0.5 ? '+' : '-';
            if (operation === '+') {
                result += number;
            } else {
                result -= number;
            }
        } else {
            operation = '+';
            result += number;
        }
        operations.push({ operation, number });
    }

    timeoutId = setTimeout(nextOperation, speed);
}

function nextOperation() {
    const opsDisplay = document.getElementById('operations');
    if (counter < amount - 1) {
        let { operation, number } = operations[counter];
        let newText = `${operation} ${number}`;
        opsDisplay.innerText = newText;
        opsDisplay.classList.add('fade-in');
        
        const bip = document.getElementById('sound');
        if(bip) { bip.currentTime = 0; bip.play().catch(()=>{}); }
        
        counter++;
        setTimeout(() => {
            opsDisplay.classList.remove('fade-in');
        }, 400); 
        timeoutId = setTimeout(nextOperation, speed);
    } else {
        opsDisplay.innerText = '= ?';
        opsDisplay.classList.add('fade-in');
        setTimeout(() => {
            opsDisplay.classList.remove('fade-in');
        }, 400);
    }
}

function checkResult() {
    const answerInput = document.getElementById('answer');
    const resultLog = document.getElementById('result');
    
    // Hacemos visible la caja de la bitácora al verificar el resultado
    resultLog.style.display = 'block'; 
    
    const rawValue = answerInput.value.trim();
    
    if (rawValue === "") return;

    let message;
    let operationSequence = `${initialResult}`;
    operations.forEach(op => {
        operationSequence += ` ${op.operation} ${op.number}`;
    });
    operationSequence += ` = ${result}`;

    answerInput.classList.remove('correct-state', 'error-state');

    // Comprueba de forma estricta que no se cuele ninguna letra
    const isPureNumber = /^\d+$/.test(rawValue);
    let userResult = isPureNumber ? parseInt(rawValue) : null;

    if (isPureNumber && userResult === result) {
        message = '✓ ANÁLISIS CORRECTO:';
        answerInput.classList.add('correct-state');
        if(soundCorrect) { soundCorrect.currentTime = 0; soundCorrect.play().catch(()=>{}); }
    } else {
        message = '⚠ ANOMALÍA EN RESULTADO:';
        answerInput.classList.add('error-state');
        if(soundIncorrect) { soundIncorrect.currentTime = 0; soundIncorrect.play().catch(()=>{}); }
    }
    
    resultLog.innerText = `${message} Secuencia analizada -> [ ${operationSequence} ]`;
    resultLog.classList.add('pop-effect');
    setTimeout(() => resultLog.classList.remove('pop-effect'), 300);
}

function resetGame() {
    const answerInput = document.getElementById('answer');
    answerInput.classList.remove('correct-state', 'error-state');
    answerInput.value = '';
    
    // Limpiamos el texto y ocultamos la bitácora para el nuevo juego
    document.getElementById('result').innerText = '';
    document.getElementById('result').style.display = 'none'; 
    
    document.getElementById('operations').innerText = '—';
}

function startGame() {
    resetGame();
    generateOperations();
}

function stopGame() {
    clearTimeout(timeoutId);
    resetGame();
}
