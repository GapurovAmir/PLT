let students = [
  { id: 1, name: "Алия Садыкова", subject: "JavaScript", grade: 92 },
  { id: 2, name: "Данияр Ким", subject: "Базы данных", grade: 84 },
  { id: 3, name: "Марат Нуров", subject: "JavaScript", grade: 76 },
  { id: 4, name: "Аружан Иманова", subject: "Python", grade: 96 },
  { id: 5, name: "Тимур Алиев", subject: "Базы данных", grade: 43 }
];
let nextId = 6;
let currentPage = "students";
let searchTerm = "";
let showForm = false;
const content = document.querySelector("#content");
const tabs = document.querySelectorAll("[data-page]");
const pageTitles = { students: "Студенты", grades: "Оценки", stats: "Статистика" };

function node(tag, text, className) {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
}
function getAverage() {
  return students.length ? students.reduce((sum, student) => sum + student.grade, 0) / students.length : 0;
}
function renderMetrics() {
  const metrics = document.querySelector("#metrics");
  metrics.replaceChildren();
  const data = [
    ["Всего студентов", students.length, "◫", "Записей в журнале"],
    ["Средний балл", getAverage().toFixed(1), "◩", "По всем предметам"],
    ["Успеваемость", `${students.length ? Math.round(students.filter(s => s.grade >= 50).length / students.length * 100) : 0}%`, "✓", "Оценка 50 и выше"]
  ];
  data.forEach(([label, value, icon, note]) => {
    const card = node("div", undefined, "metric");
    const text = node("div");
    text.append(node("span", label, "metric-label"), node("strong", String(value), "metric-value"), node("div", note, "metric-note"));
    card.append(text, node("div", icon, "metric-icon"));
    metrics.append(card);
  });
}
function addSectionHeader(title, description, actionText, onAction) {
  const head = node("div", undefined, "section-head");
  const left = node("div");
  left.append(node("h2", title), node("p", description));
  head.append(left);
  if (actionText) {
    const button = node("button", actionText, "primary");
    button.addEventListener("click", onAction);
    head.append(button);
  }
  content.append(head);
}
function renderStudentForm() {
  const form = node("form", undefined, "student-form");
  form.innerHTML = `
    <div class="form-grid">
      <div class="field"><label for="student-name">ИМЯ И ФАМИЛИЯ</label><input id="student-name" name="name" maxlength="80" required placeholder="Например, Алия Садыкова"></div>
      <div class="field"><label for="student-subject">ПРЕДМЕТ</label><select id="student-subject" name="subject"><option>JavaScript</option><option>Python</option><option>Базы данных</option><option>HTML и CSS</option></select></div>
      <div class="field"><label for="student-grade">ОЦЕНКА (0–100)</label><input id="student-grade" name="grade" type="number" min="0" max="100" required placeholder="85"></div>
    </div>`;
  const actions = node("div", undefined, "form-actions");
  const submit = node("button", "Сохранить запись", "primary");
  submit.type = "submit";
  const message = node("span", "", "form-message");
  message.id = "form-message";
  actions.append(submit, message);
  form.append(actions);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const subject = String(data.get("subject"));
    const grade = Number(data.get("grade"));
    if (!name || !Number.isFinite(grade) || grade < 0 || grade > 100) {
      message.textContent = "Проверьте имя и оценку от 0 до 100.";
      return;
    }
    students.push({ id: nextId++, name, subject, grade });
    showForm = false;
    searchTerm = "";
    render();
  });
  content.append(form);
}
function renderStudents() {
  addSectionHeader("Список студентов", "Добавляйте записи и следите за результатами.", showForm ? "Скрыть форму" : "+ Добавить студента", () => {
    showForm = !showForm;
    render();
  });
  if (showForm) renderStudentForm();

  const tools = node("div", undefined, "table-tools");
  const search = node("input", undefined, "search-input");
  search.type = "search";
  search.placeholder = "Поиск по имени или предмету...";
  search.value = searchTerm;
  search.setAttribute("aria-label", "Поиск по студентам");
  search.addEventListener("input", () => {
    searchTerm = search.value;
    renderTable();
  });
  tools.append(search);
  content.append(tools);
  const tableArea = node("div", undefined, "table-wrap");
  tableArea.id = "table-area";
  content.append(tableArea);
  renderTable();
}
function renderTable() {
  const area = document.querySelector("#table-area");
  if (!area) return;
  area.replaceChildren();
  const filtered = students.filter(student => `${student.name} ${student.subject}`.toLowerCase().includes(searchTerm.toLowerCase()));
  if (!filtered.length) {
    area.append(node("div", "Ничего не найдено. Попробуйте изменить запрос.", "empty"));
    return;
  }
  const table = node("table");
  const thead = node("thead");
  const headerRow = node("tr");
  ["СТУДЕНТ", "ПРЕДМЕТ", "ОЦЕНКА", "СТАТУС", ""].forEach(label => headerRow.append(node("th", label)));
  thead.append(headerRow);
  const tbody = node("tbody");
  filtered.forEach(student => {
    const row = node("tr");
    const nameCell = node("td");
    const person = node("div", undefined, "student-name");
    person.append(node("span", student.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase(), "student-initial"));
    const names = node("div");
    names.append(node("span", student.name), node("small", `ID-${String(student.id).padStart(3, "0")}`));
    person.append(names);
    nameCell.append(person);
    row.append(nameCell, node("td", student.subject), node("td", String(student.grade)));
    const statusCell = node("td");
    statusCell.append(node("span", student.grade >= 50 ? "Зачёт" : "Ниже нормы", `grade-pill${student.grade < 50 ? " low" : ""}`));
    row.append(statusCell);
    const actionCell = node("td");
    const remove = node("button", "×", "delete-button");
    remove.title = "Удалить запись";
    remove.setAttribute("aria-label", `Удалить ${student.name}`);
    remove.addEventListener("click", () => {
      students = students.filter(item => item.id !== student.id);
      render();
    });
    actionCell.append(remove);
    row.append(actionCell);
    tbody.append(row);
  });
  table.append(thead, tbody);
  area.append(table);
}
function renderGrades() {
  addSectionHeader("Ведомость оценок", "Оценки сгруппированы по предметам.");
  const filter = node("select", undefined, "subject-filter");
  filter.setAttribute("aria-label", "Фильтр по предмету");
  ["Все предметы", ...new Set(students.map(s => s.subject))].forEach(subject => filter.append(node("option", subject)));
  const tools = node("div", undefined, "table-tools");
  tools.append(filter);
  content.append(tools);
  const area = node("div", undefined, "table-wrap");
  content.append(area);
  function draw() {
    area.replaceChildren();
    const selected = filter.value;
    const list = students.filter(s => selected === "Все предметы" || s.subject === selected);
    if (!list.length) { area.append(node("div", "Нет записей для отображения.", "empty")); return; }
    const table = node("table");
    const thead = node("thead");
    const tr = node("tr");
    ["СТУДЕНТ", "ПРЕДМЕТ", "БАЛЛ", "РЕЗУЛЬТАТ"].forEach(x => tr.append(node("th", x)));
    thead.append(tr);
    const tbody = node("tbody");
    list.forEach(student => {
      const row = node("tr");
      [student.name, student.subject, String(student.grade), student.grade >= 50 ? "Зачёт" : "Нужно улучшить"].forEach((value, index) => {
        const td = node("td", value);
        if (index === 2) td.append(node("span", student.grade >= 50 ? " ✓" : " !", student.grade >= 50 ? "form-message" : "delete-button"));
        row.append(td);
      });
      tbody.append(row);
    });
    table.append(thead, tbody);
    area.append(table);
  }
  filter.addEventListener("change", draw);
  draw();
}
function renderStats() {
  addSectionHeader("Аналитика успеваемости", "Краткий обзор текущих результатов группы.");
  const average = getAverage();
  const passed = students.filter(s => s.grade >= 50).length;
  const grid = node("div", undefined, "stats-grid");
  const averageBox = node("div", undefined, "stat-box");
  averageBox.append(node("h3", "СРЕДНИЙ БАЛЛ"), node("strong", average.toFixed(1)), node("p", "Среднее значение оценок по всем записям"));
  const passedBox = node("div", undefined, "stat-box");
  passedBox.append(node("h3", "УСПЕШНОСТЬ"), node("strong", `${students.length ? Math.round(passed / students.length * 100) : 0}%`), node("p", `${passed} из ${students.length} записей с результатом 50 и выше`));
  grid.append(averageBox, passedBox);
  const subjectBox = node("div", undefined, "stat-box");
  subjectBox.append(node("h3", "СРЕДНИЙ БАЛЛ ПО ПРЕДМЕТАМ"));
  const bars = node("div", undefined, "bar-list");
  const subjects = [...new Set(students.map(s => s.subject))];
  subjects.forEach(subject => {
    const group = students.filter(s => s.subject === subject);
    const mean = group.reduce((sum, s) => sum + s.grade, 0) / group.length;
    const row = node("div", undefined, "bar-row");
    const track = node("div", undefined, "bar-track");
    const fill = node("div", undefined, "bar-fill");
    fill.style.width = `${mean}%`;
    track.append(fill);
    row.append(node("span", subject), track, node("strong", mean.toFixed(0)));
    bars.append(row);
  });
  subjectBox.append(bars);
  grid.append(subjectBox);
  content.append(grid);
}
function render() {
  document.querySelector("#page-title").textContent = pageTitles[currentPage];
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.page === currentPage));
  renderMetrics();
  content.replaceChildren();
  if (currentPage === "students") renderStudents();
  if (currentPage === "grades") renderGrades();
  if (currentPage === "stats") renderStats();
}
tabs.forEach(tab => tab.addEventListener("click", () => {
  currentPage = tab.dataset.page;
  showForm = false;
  render();
}));
document.querySelector(".brand").addEventListener("click", event => {
  event.preventDefault();
  currentPage = "students";
  render();
});
render();
