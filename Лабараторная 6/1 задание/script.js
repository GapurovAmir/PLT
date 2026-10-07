const productInput = document.querySelector("#productInput");
const addBtn = document.querySelector("#addBtn");
const shoppingList = document.querySelector("#shoppingList");
const message = document.querySelector("#message");
const clearBtn = document.querySelector("#clearBtn");

function addProduct() {
    const productName = productInput.value.trim();

    if (productName === "") {
        message.textContent = "Введите название товара.";
        return;
    }

    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = productName;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");

    li.append(text, deleteBtn);
    shoppingList.append(li);

    productInput.value = "";
    message.textContent = "Товар добавлен!";

    li.addEventListener("click", function(event) {
        if (event.target !== deleteBtn) {
            li.classList.toggle("completed");
        }
    });

    deleteBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        li.remove();
        message.textContent = "Товар удалён.";
    });
}

addBtn.addEventListener("click", addProduct);

productInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addProduct();
    }
});

clearBtn.addEventListener("click", function() {
    shoppingList.innerHTML = "";
    message.textContent = "Список очищен.";
});