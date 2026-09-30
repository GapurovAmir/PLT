const createButton = document.querySelector("#createBtn");
const themeButton = document.querySelector("#themeBtn");

const nameInput = document.querySelector("#name");
const groupInput = document.querySelector("#group");
const courseInput = document.querySelector("#course");

const card = document.querySelector("#card");
const message = document.querySelector("#message");

const studentName = document.querySelector("#studentName");
const studentGroup = document.querySelector("#studentGroup");
const studentCourse = document.querySelector("#studentCourse");
const studentInfo = document.querySelector("#studentInfo");


// Пользовательская функция
function createStudentCard(name, group, course) {

    studentName.textContent = `Студент: ${name}`;
    studentGroup.textContent = `Группа: ${group}`;
    studentCourse.textContent = `Курс: ${course}`;

    // Условие if/else
    if (course >= 3) {
        studentInfo.textContent = "Статус: старшие курсы";
    } else {
        studentInfo.textContent = "Статус: младшие курсы";
    }

    card.style.display = "block";
}


// Событие click
createButton.addEventListener("click", function () {

    const name = nameInput.value.trim();
    const group = groupInput.value.trim();
    const course = Number(courseInput.value);

    // Проверка данных
    if (name === "" || group === "" || course === 0) {
        message.textContent = "Заполните все поля!";
        card.style.display = "none";
        return;
    }

    if (course < 1 || course > 6) {
        message.textContent = "Курс должен быть от 1 до 6.";
        card.style.display = "none";
        return;
    }

    message.textContent = "";

    createStudentCard(name, group, course);
});


// Второе событие click
themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark");
});


// Дополнительный цикл
const courses = [1, 2, 3, 4, 5, 6];

for (let i = 0; i < courses.length; i++) {
    console.log(`Доступен курс: ${courses[i]}`);
}
