const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("transactionForm");
let pagecontent = document.getElementById("pagecontent");

let descriptionInput = document.getElementById("descriptionInput");
let amountInput = document.getElementById("amountInput");
let typeInput = document.getElementById("typeInput");
let dateInput = document.getElementById("dateInput");

let editIndex = null;

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  pagecontent.classList.add("blur");
  editIndex = null;
});

closeBtn.addEventListener("click", closeModal);

function closeModal() {
  modal.style.display = "none";
  pagecontent.classList.remove("blur");
  form.reset();
  editIndex = null;
}

function saveToLocalStorage(arr) {
  localStorage.setItem("transactions", JSON.stringify(arr));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

function addTransactionCard(transaction, index) {
  const container = document.getElementById("transactionlist");
  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "col-lg-3", "col-md-5", "col-sm-12");

  const bgColor = transaction.type === "income" ? "bg-success" : "bg-danger";

  card.innerHTML = `
    <div class="card-body d-flex flex-column justify-content-between p-3 border rounded ${bgColor}">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="text-white">#${index + 1}</h5>
        <div>
          <button class="btn btn-light p-1" data-action="edit" data-index="${index}" aria-label="Edit">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn btn-light p-1" data-action="delete" data-index="${index}" aria-label="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <p class="text-white mb-1"><b>Details:</b> ${escapeHtml(transaction.description)}</p>
      <p class="text-white mb-1"><b>Amount:</b> $${transaction.amount}</p>
      <p class="text-white mb-1"><b>Date:</b> ${escapeHtml(transaction.date)}</p>
    </div>
  `;

  container.appendChild(card);
}

function renderCards() {
  const container = document.getElementById("transactionlist");
  container.innerHTML = "";

  const arr = getFromLocalStorage();
  arr.forEach((t, i) => addTransactionCard(t, i));

  attachButtonEvents();
}

function attachButtonEvents() {
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-edit");
      editTransaction(index);
    });
  });

  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-delete");
      deleteTransaction(index);
    });
  });
}

function deleteTransaction(index) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  const arr = getFromLocalStorage();
  arr.splice(index, 1);
  saveToLocalStorage(arr);
  renderCards();
}


function editTransaction(index) {
  const arr = getFromLocalStorage();
  const t = arr[index];

  descriptionInput.value = t.description;
  amountInput.value = t.amount;
  dateInput.value = t.date;
  typeInput.value = t.type;

  editIndex = index;

  modal.style.display = "flex";
  pagecontent.classList.add("blur");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const arr = getFromLocalStorage();
  const newTransaction = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
    date: dateInput.value
  };

  if (editIndex !== null) {
    arr[editIndex] = newTransaction;
  } else {
    arr.push(newTransaction);
  }

  saveToLocalStorage(arr);
  renderCards();
  closeModal();
});

window.addEventListener("DOMContentLoaded", renderCards);
