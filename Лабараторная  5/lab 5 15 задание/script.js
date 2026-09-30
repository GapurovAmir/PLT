// Получаем элементы HTML
const guessInput = document.querySelector("#guessInput");
const guessButton = document.querySelector("#guessButton");
const newGameButton = document.querySelector("#newGameButton");
const themeButton = document.querySelector("#themeButton");

const hint = document.querySelector("#hint");
const attemptsText = document.querySelector("#attempts");
const recordText = document.querySelector("#record");

// Переменные игры
let secretNumber;
let attempts;
let gameOver = false;
let bestScore = null;

// Массив для хранения попыток
let guessHistory = [];


// Функция создания случайного числа
function generateNumber() {
    return Math.floor(Math.random() * 100) + 1;
}


// Функция начала новой игры
function startGame() {

    secretNumber = generateNumber();

    attempts = 0;

    gameOver = false;

    guessHistory = [];

    guessInput.value = "";

    hint.textContent = "Введите число от 1 до 100";

    hint.className = "";

    attemptsText.textContent = "Количество попыток: 0";

    guessInput.disabled = false;

    guessButton.disabled = false;

    guessInput.focus();
}


// Функция проверки числа
function checkGuess() {

    // Если игра закончена, ничего не делаем
    if (gameOver) {
        return;
    }

    // Получаем число из поля
    const userGuess = Number(guessInput.value);


    // Проверяем правильность ввода
    if (!userGuess || userGuess < 1 || userGuess > 100) {

        hint.textContent = "Введите число от 1 до 100";

        hint.className = "error";

        return;
    }


    // Увеличиваем количество попыток
    attempts++;

    attemptsText.textContent =
        "Количество попыток: " + attempts;


    // Записываем попытку в массив
    guessHistory.push(userGuess);


    // Проверяем число
    if (userGuess === secretNumber) {

        hint.textContent =
            "🎉 Поздравляем! Вы угадали число " + secretNumber + "!";

        hint.className = "success";

        gameOver = true;

        guessInput.disabled = true;

        guessButton.disabled = true;


        // Проверяем рекорд
        if (bestScore === null || attempts < bestScore) {

            bestScore = attempts;

            recordText.textContent =
                "Рекорд: " + bestScore + " попыток";
        }

    }

    else if (userGuess < secretNumber) {

        hint.textContent =
            "⬆️ Загаданное число БОЛЬШЕ";

        hint.className = "error";

    }

    else {

        hint.textContent =
            "⬇️ Загаданное число МЕНЬШЕ";

        hint.className = "error";
    }


    // Очищаем поле
    guessInput.value = "";

    guessInput.focus();


    // Цикл для перебора истории попыток
    let historyText = "";

    for (let i = 0; i < guessHistory.length; i++) {

        historyText +=
            (i + 1) + ": " + guessHistory[i] + " ";
    }

    console.log("История попыток:", historyText);
}


// Кнопка "Проверить"
guessButton.addEventListener("click", checkGuess);


// Нажатие Enter
guessInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        checkGuess();
    }
});


// Кнопка "Новая игра"
newGameButton.addEventListener("click", startGame);


// Кнопка изменения темы
themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️ Светлая тема";

    }

    else {

        themeButton.textContent = "🌙 Тема";
    }
});


// Запускаем игру
startGame();
