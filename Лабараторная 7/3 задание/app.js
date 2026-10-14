const pages = {
  about: {
    title: "Немного обо мне",
    intro: "Люблю разбираться, как устроены технологии, и учиться через практику.",
    cards: [
      { icon: "⌘", title: "Мой подход", text: "Сначала понять задачу, затем разбить её на простые шаги и написать понятный код." },
      { icon: "↗", title: "Моя цель", text: "Стать разработчиком, создавать полезные продукты и постоянно расти профессионально." },
      { icon: "◎", title: "Вне кода", text: "Музыка, книги, новые идеи и небольшие эксперименты." }
    ]
  },
  skills: {
    title: "Инструменты в моём наборе",
    intro: "Навыки, которые я развиваю на учебных и личных проектах.",
    skills: [
      ["HTML5", "Структура страниц"], ["CSS3", "Стили и адаптивность"],
      ["JavaScript", "Интерактивность"], ["Python", "Основы программирования"],
      ["Git", "Контроль версий"], ["UI basics", "Основы интерфейсов"]
    ]
  },
  projects: {
    title: "Изучаю на практике",
    intro: "Небольшие проекты помогают закреплять знания и пробовать новые решения.",
    projects: [
      { icon: "▤", title: "Личный сайт", text: "Адаптивная страница с разделами и динамическим контентом.", tag: "HTML · CSS · JS" },
      { icon: "✓", title: "Task tracker", text: "Список задач с фильтрами и возможностью менять статус.", tag: "JAVASCRIPT" },
      { icon: "{ }", title: "Python practice", text: "Набор учебных программ для тренировки логики и работы с данными.", tag: "PYTHON" }
    ]
  }
};
const content = document.querySelector("#content");
const tabs = document.querySelectorAll("[data-page]");
document.querySelector("#year").textContent = new Date().getFullYear();

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function showPage(pageName) {
  const page = pages[pageName];
  content.replaceChildren();
  content.append(element("h2", "section-heading", page.title));
  content.append(element("p", "section-intro", page.intro));
  if (page.cards) {
    const grid = element("div", "info-grid");
    page.cards.forEach(item => {
      const card = element("article", "info-card");
      card.append(element("div", "card-icon", item.icon), element("h3", "", item.title), element("p", "", item.text));
      grid.append(card);
    });
    content.append(grid);
  }
  if (page.skills) {
    const grid = element("div", "skill-list");
    page.skills.forEach(([name, description]) => {
      const row = element("div", "skill");
      row.append(element("strong", "", name), element("small", "", description));
      grid.append(row);
    });
    content.append(grid);
  }
  if (page.projects) {
    const grid = element("div", "project-grid");
    page.projects.forEach(item => {
      const card = element("article", "project-card");
      card.append(element("div", "project-top", item.icon), element("h3", "", item.title), element("p", "", item.text), element("span", "tag", item.tag));
      grid.append(card);
    });
    content.append(grid);
  }
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.page === pageName));
}
tabs.forEach(tab => tab.addEventListener("click", () => showPage(tab.dataset.page)));
document.querySelector(".hero-button").addEventListener("click", () => {
  showPage("projects");
  document.querySelector(".tabs").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector(".brand").addEventListener("click", event => {
  event.preventDefault();
  showPage("about");
});
showPage("about");
