const form = document.getElementById("transaction-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const list = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ----- RENDER CARDS -----
function renderTransactions() {
    list.innerHTML = "";

    transactions.forEach((transaction, index) => {
        if (!transaction.hidden) { // only show if not deleted
            const card = document.createElement("div");
            card.className = "transaction-card";

            card.innerHTML = `
                <p><strong>ID:</strong> ${index + 1}</p>
                <p><strong>Name:</strong> ${transaction.name}</p>
                <p><strong>Amount:</strong> ${transaction.amount} MAD</p>
            `;

            const modifyBtn = document.createElement("button");
            modifyBtn.textContent = "Modify";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";

            // ----- MODIFY -----
            modifyBtn.addEventListener("click", () => {
                const newName = prompt("Enter new name:", transaction.name);
                const newAmount = prompt("Enter new amount:", transaction.amount);

                if (newName !== null && newAmount !== null) {
                    transaction.name = newName;
                    transaction.amount = newAmount;
                    localStorage.setItem("transactions", JSON.stringify(transactions));
                    renderTransactions();
                }
            });

            // ----- DELETE WITH CONFIRM -----
            deleteBtn.addEventListener("click", () => {
                const confirmDelete = confirm("Are you sure you want to delete this transaction?");
                if (confirmDelete) {
                    transaction.hidden = true; // hide instead of deleting
                    localStorage.setItem("transactions", JSON.stringify(transactions));
                    renderTransactions(); // refresh
                }
            });

            card.appendChild(modifyBtn);
            card.appendChild(deleteBtn);
            list.appendChild(card);
        }
    });
}

// ----- ADD NEW TRANSACTION -----
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTransaction = {
        name: nameInput.value,
        amount: amountInput.value,
        hidden: false
    };

    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    nameInput.value = "";
    amountInput.value = "";

    renderTransactions();
});

renderTransactions();

