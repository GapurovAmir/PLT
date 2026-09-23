const form = document.getElementById("registrationForm");

const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const loginMessage = document.getElementById("loginMessage");
const emailMessage = document.getElementById("emailMessage");
const passwordMessage = document.getElementById("passwordMessage");
const confirmMessage = document.getElementById("confirmMessage");

const passwordBar = document.getElementById("passwordBar");
const result = document.getElementById("result");


// Проверка логина
function checkLogin() {
    const value = login.value.trim();

    if (value === "") {
        login.classList.remove("valid");
        login.classList.add("invalid");

        loginMessage.textContent = "Введите логин";
        loginMessage.className = "message invalid-message";

        return false;
    }

    if (value.length < 3) {
        login.classList.remove("valid");
        login.classList.add("invalid");

        loginMessage.textContent = "Логин должен содержать минимум 3 символа";
        loginMessage.className = "message invalid-message";

        return false;
    }

    login.classList.remove("invalid");
    login.classList.add("valid");

    loginMessage.textContent = "Логин корректный ✓";
    loginMessage.className = "message valid-message";

    return true;
}


// Проверка e-mail
function checkEmail() {
    const value = email.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
        email.classList.remove("valid");
        email.classList.add("invalid");

        emailMessage.textContent = "Введите e-mail";
        emailMessage.className = "message invalid-message";

        return false;
    }

    if (!emailPattern.test(value)) {
        email.classList.remove("valid");
        email.classList.add("invalid");

        emailMessage.textContent = "Введите корректный e-mail";
        emailMessage.className = "message invalid-message";

        return false;
    }

    email.classList.remove("invalid");
    email.classList.add("valid");

    emailMessage.textContent = "E-mail корректный ✓";
    emailMessage.className = "message valid-message";

    return true;
}


// Проверка пароля
function checkPassword() {
    const value = password.value;

    if (value === "") {
        password.classList.remove("valid");
        password.classList.add("invalid");

        passwordMessage.textContent = "Введите пароль";
        passwordMessage.className = "message invalid-message";

        passwordBar.style.width = "0%";
        passwordBar.style.background = "#ef4444";

        return false;
    }

    if (value.length < 8) {
        password.classList.remove("valid");
        password.classList.add("invalid");

        passwordMessage.textContent =
            `Слишком короткий пароль (${value.length}/8 символов)`;

        passwordMessage.className = "message invalid-message";

        passwordBar.style.width = `${Math.min(value.length * 12.5, 100)}%`;
        passwordBar.style.background = "#ef4444";

        return false;
    }

    password.classList.remove("invalid");
    password.classList.add("valid");

    passwordMessage.textContent = "Пароль подходит ✓";
    passwordMessage.className = "message valid-message";

    passwordBar.style.width = "100%";
    passwordBar.style.background = "#22c55e";

    return true;
}


// Проверка совпадения паролей
function checkConfirmPassword() {
    const value = confirmPassword.value;

    if (value === "") {
        confirmPassword.classList.remove("valid");
        confirmPassword.classList.add("invalid");

        confirmMessage.textContent = "Повторите пароль";
        confirmMessage.className = "message invalid-message";

        return false;
    }

    if (value !== password.value) {
        confirmPassword.classList.remove("valid");
        confirmPassword.classList.add("invalid");

        confirmMessage.textContent = "Пароли не совпадают";
        confirmMessage.className = "message invalid-message";

        return false;
    }

    confirmPassword.classList.remove("invalid");
    confirmPassword.classList.add("valid");

    confirmMessage.textContent = "Пароли совпадают ✓";
    confirmMessage.className = "message valid-message";

    return true;
}


// Проверка при вводе
login.addEventListener("input", checkLogin);
email.addEventListener("input", checkEmail);
password.addEventListener("input", function() {
    checkPassword();
    checkConfirmPassword();
});

confirmPassword.addEventListener("input", checkConfirmPassword);


// Проверка при отправке формы
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const loginCorrect = checkLogin();
    const emailCorrect = checkEmail();
    const passwordCorrect = checkPassword();
    const confirmCorrect = checkConfirmPassword();

    if (
        !loginCorrect ||
        !emailCorrect ||
        !passwordCorrect ||
        !confirmCorrect
    ) {
        result.textContent = "Исправьте ошибки в форме";
        result.style.color = "#dc2626";

        return;
    }

    result.textContent = "Регистрация успешно выполнена! ✓";
    result.style.color = "#16a34a";
});
