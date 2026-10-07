const cardInput = document.querySelector("#cardInput");
const addCardBtn = document.querySelector("#addCardBtn");
const message = document.querySelector("#message");

const newCards = document.querySelector("#newCards");
const progressCards = document.querySelector("#progressCards");
const doneCards = document.querySelector("#doneCards");

function createCard(title) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = title;

    const buttons = document.createElement("div");
    buttons.classList.add("card-buttons");

    const backBtn = document.createElement("button");
    backBtn.textContent = "← Назад";

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Вперёд →";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");

    buttons.append(backBtn, nextBtn, deleteBtn);
    card.append(cardTitle, buttons);

    updateButtons();

    function updateButtons() {
        const parent = card.parentElement;

        backBtn.style.display = "inline-block";
        nextBtn.style.display = "inline-block";

        if (parent === newCards) {
            backBtn.style.display = "none";
        }

        if (parent === doneCards) {
            nextBtn.style.display = "none";
        }
    }

    nextBtn.addEventListener("click", function() {
        if (card.parentElement === newCards) {
            progressCards.append(card);
        } else if (card.parentElement === progressCards) {
            doneCards.append(card);
        }

        updateButtons();
        message.textContent = "Карточка перемещена вперёд.";
    });

    backBtn.addEventListener("click", function() {
        if (card.parentElement === doneCards) {
            progressCards.append(card);
        } else if (card.parentElement === progressCards) {
            newCards.append(card);
        }

        updateButtons();
        message.textContent = "Карточка перемещена назад.";
    });

    deleteBtn.addEventListener("click", function() {
        card.remove();
        message.textContent = "Карточка удалена.";
    });

    return card;
}

function addCard() {
    const title = cardInput.value.trim();

    if (title === "") {
        message.textContent = "Введите название задачи.";
        return;
    }

    const card = createCard(title);

    newCards.append(card);

    cardInput.value = "";
    message.textContent = "Новая карточка добавлена.";
}

addCardBtn.addEventListener("click", addCard);

cardInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addCard();
    }
});