const addBtn = document.getElementById("add-btn");
const viewBtn = document.getElementById("view-btn");
const categoryInput = document.getElementById("category-select");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const tableBody = document.getElementById("expense-table-body");
const totalAmountEl = document.getElementById("total-amount");
const ctx = document.getElementById("expenseChart").getContext("2d");

let expenses = [];
let chart; // store chart instance

function renderExpenses() {
  tableBody.innerHTML = "";
  let total = 0;

  expenses.forEach((expense, index) => {
    total += expense.amount;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.category}</td>
      <td>${expense.amount}</td>
      <td>${expense.date}</td>
      <td><button onclick="editExpense(${index})">Edit</button></td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;

    tableBody.appendChild(row);
  });

  totalAmountEl.textContent = total;
}

addBtn.addEventListener("click", () => {
  const category = categoryInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (amount && date) {
    expenses.push({ category, amount, date });
    renderExpenses();
    amountInput.value = "";
    dateInput.value = "";
  }
});

viewBtn.addEventListener("click", () => {
  renderExpenses();
  showChart();
});

window.deleteExpense = function (index) {
  expenses.splice(index, 1);
  renderExpenses();
};

window.editExpense = function (index) {
  const expense = expenses[index];
  categoryInput.value = expense.category;
  amountInput.value = expense.amount;
  dateInput.value = expense.date;

  addBtn.textContent = "Update";
  addBtn.onclick = () => {
    expenses[index] = {
      category: categoryInput.value,
      amount: Number(amountInput.value),
      date: dateInput.value,
    };
    renderExpenses();
    addBtn.textContent = "Add";
    resetAddBtn();
    amountInput.value = "";
    dateInput.value = "";
  };
};

function resetAddBtn() {
  addBtn.onclick = () => {
    const category = categoryInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    if (amount && date) {
      expenses.push({ category, amount, date });
      renderExpenses();
      amountInput.value = "";
      dateInput.value = "";
    }
  };
}

function showChart() {
  // group expenses by category
  const categoryTotals = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) {
    chart.destroy(); // clear old chart before drawing new
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#27AE60", "#E67E22"],
      }]
    }
  });
}
