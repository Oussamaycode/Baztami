const pagecontent = document.getElementById("pagecontent");
const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.querySelector("#myModal .btn-secondary");
const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");

const transactionList = document.getElementById("transactionlist");
const balanceEl = document.getElementById("balance-amount");
const incomeEl = document.getElementById("income-amount");
const expensesEl = document.getElementById("expenses-amount");

let transactions = [];
let editingIndex = -1;

// Load
if(localStorage.getItem("transactions")){
  transactions = JSON.parse(localStorage.getItem("transactions"));
  renderTransactions();
}

// Save
function saveTransactions(){
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Open modal
openBtn.addEventListener("click", () => {
  editingIndex = -1;
  modal.style.display = "flex";
  pagecontent.classList.add("blur");
});

// Close modal
function closeModal(){
  modal.style.display = "none";
  pagecontent.classList.remove("blur");
  form.reset();
}
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

// Add transaction
form.addEventListener("submit", e => {
  e.preventDefault();

  if(editingIndex >= 0){
    const oldId = transactions[editingIndex].id;

    transactions[editingIndex] = {
      id: oldId,
      description: descriptionInput.value,
      amount: parseFloat(amountInput.value),
      type: typeInput.value,
      deleted: false
    };

  } else {
    transactions.push({
      id: transactions.length + 1,   // ✅ ID = index + 1 FOREVER
      description: descriptionInput.value,
      amount: parseFloat(amountInput.value),
      type: typeInput.value,
      deleted: false
    });
  }

  saveTransactions();
  renderTransactions();
  closeModal();
});

// Render all
function renderTransactions(){
  transactionList.innerHTML = "";
  transactions.forEach(tx => {
    if(!tx.deleted){
      addCard(tx);
    }
  });
  recalcStats();
}

function addCard(tx){
  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "col-lg-3", "col-md-5", "col-sm-12", "m-2");
  card.id = `tx-${tx.id}`;

  const bg = tx.type === "income" ? "bg-success" : "bg-danger";

  card.innerHTML = `
    <div class="card-body border rounded p-3 ${bg}">
      <h6 class="text-white">ID: ${tx.id}</h6>
      <p class="text-white">${tx.description}</p>
      <p class="text-white">$${tx.amount.toFixed(2)}</p>

      <button class="btn btn-light btn-sm" id="modify-${tx.id}">Modify</button>
      <button class="btn btn-light btn-sm" id="delete-${tx.id}">Delete</button>
    </div>
  `;

  transactionList.appendChild(card);

  // Modify
  document.getElementById(`modify-${tx.id}`).addEventListener("click", () => {
    editingIndex = tx.id - 1; // since id = index + 1
    descriptionInput.value = tx.description;
    amountInput.value = tx.amount;
    typeInput.value = tx.type;
    modal.style.display = "flex";
    pagecontent.classList.add("blur");
  });

  // Delete (HIDE ONLY)
 document.getElementById(`delete-${tx.id}`).addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to delete this transaction?");

  if (confirmDelete) {
    tx.deleted = true;                                      
    document.getElementById(`tx-${tx.id}`).style.display = "none"; 
    recalcStats();
    alert("Transaction deleted successfully!");         
  }
});

}

// Stats
function recalcStats(){
  let balance = 0, income = 0, expenses = 0;

  transactions.forEach(tx => {
    if(tx.deleted) return;
    if(tx.type === "income"){
      income += tx.amount;
      balance += tx.amount;
    } else {
      expenses += tx.amount;
      balance -= tx.amount;
    }
  });

  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeEl.textContent = `$${income.toFixed(2)}`;
  expensesEl.textContent = `$${expenses.toFixed(2)}`;
}
