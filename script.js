let operations = [];
let initialResult = 0;
let result = 0;
let counter = 0;
let speed = 1000;
let amount = 5; // Cantidad inicial de números a mostrar
let topRange = 15; // Valor inicial del tope superior del rango
let timeoutId;

// Sonidos
const soundCorrect = document.getElementById('soundCorrect');
const soundIncorrect = document.getElementById('soundIncorrect');

function updateSpeedLabel() {
    speed = document.getElementById('speed').value;
    document.getElementById('speedLabel').innerText = speed;
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
    document.getElementById('operations').innerText = result;

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
    if (counter < amount - 1) {
        let { operation, number } = operations[counter];
        let newText = `${operation} ${number}`;
        document.getElementById('operations').innerText = newText;
        document.getElementById('operations').classList.add('fade-in');
        document.getElementById('sound').play(); // Reproducir el sonido
        counter++;
        setTimeout(() => {
            document.getElementById('operations').classList.remove('fade-in');
        }, 500); // Duración de la animación
        timeoutId = setTimeout(nextOperation, speed);
    } else {
        document.getElementById('operations').innerText = '= ?';
        document.getElementById('operations').classList.add('fade-in');
        setTimeout(() => {
            document.getElementById('operations').classList.remove('fade-in');
        }, 500); // Duración de la animación
    }
}

function checkResult() {
    let userResult = parseInt(document.getElementById('answer').value);
    let message;
    let operationSequence = `${initialResult}`;
    operations.forEach(op => {
        operationSequence += ` ${op.operation} ${op.number}`;
    });
    operationSequence += ` = ${result}`;

    if (userResult === result) {
        message = '¡Correcto!';
        soundCorrect.play(); // Reproducir sonido de correcto
    } else {
        message = `Incorrecto. La respuesta correcta era ${result}.`;
        soundIncorrect.play(); // Reproducir sonido de incorrecto
    }
    document.getElementById('result').innerText = `${message} ${operationSequence}`;
}

function resetGame() {
    document.getElementById('result').innerText = '';
    document.getElementById('answer').value = '';
    document.getElement
