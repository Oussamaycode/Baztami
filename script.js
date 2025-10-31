const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");
const dateInput = document.getElementById("dateInput");

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  pagecontent.classList.add("blur");
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  pagecontent.classList.remove("blur");
  form.reset();
});


function closeModal() {
  modal.style.display = "none";
}

function addTransactionCard(newtransaction) {
  const container = document.getElementById("transactionlist");
  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "col-lg-3", "col-md-5", "col-sm-12");
  const bgColor = newtransaction.type === "income" ? "bg-success" : "bg-danger";

  card.innerHTML = `
    <div class="card-body d-flex flex-column justify-content-between p-3 border rounded ${bgColor}">
      <div>
        <div class="d-flex align-items-center gap-2">
          <h3 class="text-white">Details</h3>
          <i class="fa-solid fa-file-lines text-white"></i>
        </div>
        <p>${newtransaction.description}</p>
      </div>

      <div>
        <div class="d-flex align-items-center gap-2">
          <h3 class="text-white">Amount</h3>
          <i class="fa-solid fa-dollar-sign text-white"></i>
        </div>
        <p>$${newtransaction.amount}</p>
      </div>

      <div>
        <div class="d-flex align-items-center gap-2">
          <h3 class="text-white">Date</h3>
          <i class="fa-solid fa-calendar-day text-white"></i>
        </div>
        <p>${newtransaction.date}</p>
      </div>
    </div>
  `;

  container.appendChild(card);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const newTransaction = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
    date: dateInput.value
  };

  addTransactionCard(newTransaction);
  closeModal();
  form.reset();
});

const modifyBtn=document.getElementById("btnModify");


