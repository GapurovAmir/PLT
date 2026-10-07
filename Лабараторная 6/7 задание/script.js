const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskList = document.querySelector("#taskList");
const clearCompleted = document.querySelector("#clearCompleted");

const totalCount = document.querySelector("#totalCount");
const completedCount = document.querySelector("#completedCount");
const message = document.querySelector("#message");

function updateStatistics() {
    const tasks = document.querySelectorAll(".task");
    const completedTasks = document.querySelectorAll(".task.completed");

    totalCount.textContent = tasks.length;
    completedCount.textContent = completedTasks.length;
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        message.textContent = "Введите задачу.";
        return;
    }

    const li = document.createElement("li");
    li.classList.add("task");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = taskText;
    span.classList.add("task-text");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");

    li.append(checkbox, span, deleteBtn);
    taskList.append(li);

    checkbox.addEventListener("change", function() {
        li.classList.toggle("completed", checkbox.checked);
        updateStatistics();
    });

    deleteBtn.addEventListener("click", function() {
        li.remove();
        updateStatistics();
        message.textContent = "Задача удалена.";
    });

    taskInput.value = "";
    message.textContent = "Задача добавлена.";

    updateStatistics();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

clearCompleted.addEventListener("click", function() {
    const completedTasks = document.querySelectorAll(".task.completed");

    completedTasks.forEach(function(task) {
        task.remove();
    });

    updateStatistics();
    message.textContent = "Выполненные задачи очищены.";
});