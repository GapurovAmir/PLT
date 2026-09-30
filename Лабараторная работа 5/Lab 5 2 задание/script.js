const ageInput = document.querySelector("#age");
const checkButton = document.querySelector("#checkButton");
const result = document.querySelector("#result");

// Пользовательская функция
function checkAge(age) {

    if (age < 0) {
        return "Возраст не может быть отрицательным.";
    } else if (age < 7) {
        return "Вы ребёнок.";
    } else if (age < 18) {
        return "Вы несовершеннолетний.";
    } else if (age < 60) {
        return "Вы совершеннолетний.";
    } else {
        return "Вы пенсионер.";
    }
}

// Событие click
checkButton.addEventListener("click", function () {

    const age = Number(ageInput.value);

    if (ageInput.value === "") {
        result.textContent = "Введите возраст!";
        return;
    }

    result.textContent = checkAge(age);
});

// Событие input
ageInput.addEventListener("input", function () {

    if (ageInput.value < 0) {
        result.textContent = "Введите корректный возраст.";
    } else {
        result.textContent = "";
    }
});