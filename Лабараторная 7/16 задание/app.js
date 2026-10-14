let tasks = [
  { id: 1, title: "Закончить макет личного сайта", done: true },
  { id: 2, title: "Разобраться с обработчиками событий", done: false },
  { id: 3, title: "Подготовить материалы к занятию", done: false },
  { id: 4, title: "Повторить основы JavaScript", done: false }
];
let nextId = 5;
let currentFilter = "all";
const content = document.querySelector("#content");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const message = document.querySelector("#message");
const filterButtons = document.querySelectorAll("[data-filter]");
const labels = { all: "Все задачи", active: "Задачи в процессе", done: "Выполненные задачи" };
document.querySelector("#today").textContent = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", weekday: "short" }).format(new Date());

function updateCounts() {
  const done = tasks.filter(task => task.done).length;
  const active = tasks.length - done;
  document.querySelector("#count-all").textContent = tasks.length;
  document.querySelector("#count-active").textContent = active;
  document.querySelector("#count-done").textContent = done;
  document.querySelector("#summary-all").textContent = tasks.length;
  document.querySelector("#summary-active").textContent = active;
  document.querySelector("#summary-done").textContent = done;
}
function renderTasks() {
  updateCounts();
  document.querySelector("#list-title").textContent = labels[currentFilter];
  content.replaceChildren();
  const visible = tasks.filter(task => currentFilter === "all" || (currentFilter === "active" ? !task.done : task.done));
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = currentFilter === "done" ? "✦" : "☀";
    const text = document.createElement("div");
    text.textContent = currentFilter === "done" ? "Пока нет выполненных задач." : "Отлично! Здесь пока пусто.";
    empty.append(icon, text);
    content.append(empty);
    return;
  }
  visible.forEach(task => {
    const row = document.createElement("div");
    row.className = `task-row${task.done ? " done" : ""}`;
    const toggle = document.createElement("button");
    toggle.className = "task-check";
    toggle.textContent = task.done ? "✓" : "";
    toggle.setAttribute("aria-label", task.done ? "Вернуть задачу в работу" : "Отметить выполненной");
    toggle.addEventListener("click", () => { task.done = !task.done; renderTasks(); });
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    const tag = document.createElement("span");
    tag.className = "task-meta";
    tag.textContent = task.done ? "Готово" : "В процессе";
    const remove = document.createElement("button");
    remove.className = "delete-task";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Удалить задачу");
    remove.addEventListener("click", () => { tasks = tasks.filter(item => item.id !== task.id); renderTasks(); });
    row.append(toggle, title, tag, remove);
    content.append(row);
  });
}
filterButtons.forEach(button => button.addEventListener("click", () => {
  currentFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle("active", item === button));
  renderTasks();
}));
form.addEventListener("submit", event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) { message.textContent = "Введите название задачи."; input.focus(); return; }
  tasks.unshift({ id: nextId++, title, done: false });
  input.value = "";
  message.textContent = "Задача добавлена в список.";
  currentFilter = "all";
  filterButtons.forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
  renderTasks();
  input.focus();
});
document.querySelector(".brand").addEventListener("click", event => {
  event.preventDefault();
  currentFilter = "all";
  filterButtons.forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
  renderTasks();
});
renderTasks();
