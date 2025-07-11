const form = document.getElementById("lend-form");
const itemList = document.getElementById("item-list");
const searchInput = document.getElementById("search");
const toggleModeBtn = document.getElementById("toggle-mode");

// DARK MODE
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

function applyDarkMode() {
  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

toggleModeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  applyDarkMode();
});

applyDarkMode();

// Load items on page load
document.addEventListener("DOMContentLoaded", loadItems);

// Add new item
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const item = document.getElementById("item").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const negotiable = document.getElementById("negotiable").value;
  const contact = document.getElementById("contact").value.trim();

  if (!name || !branch || !item || !contact || isNaN(price) || !negotiable) return;

  const newItem = {
    id: Date.now(),
    name,
    branch,
    item,
    price,
    negotiable,
    contact,
    isLent: false,
  };

  saveItem(newItem);
  renderItem(newItem);
  form.reset();
});

// Search filter
searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const branch = card.getAttribute("data-branch").toLowerCase();
    const item = card.getAttribute("data-item").toLowerCase();

    card.style.display = branch.includes(query) || item.includes(query) ? "block" : "none";
  });
});

function saveItem(item) {
  const items = getItems();
  items.push(item);
  localStorage.setItem("lendItems", JSON.stringify(items));
}

function getItems() {
  return JSON.parse(localStorage.getItem("lendItems")) || [];
}

function loadItems() {
  const items = getItems();
  items.forEach(renderItem);
}

function renderItem(data) {
  const card = document.createElement("div");
  card.classList.add("card");
  if (data.isLent) card.classList.add("lent");

  card.setAttribute("data-branch", data.branch);
  card.setAttribute("data-item", data.item);

  card.innerHTML = `
    <h3>Item: ${data.item}</h3>
    <p><strong>Owner:</strong> ${data.name}</p>
    <p><strong>Branch:</strong> ${data.branch}</p>
    <p><strong>Price:</strong> ₹${data.price}</p>
    <p><strong>Negotiable:</strong> ${data.negotiable}</p>
    <p><strong>Contact:</strong> ${data.contact}</p>
    <p class="status">${data.isLent ? "Lent" : "Available"}</p>
    <button class="delete-btn">X</button>
    <button class="toggle-btn">${data.isLent ? "Mark as Available" : "Mark as Lent"}</button>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove();
    const items = getItems().filter(i => i.id !== data.id);
    localStorage.setItem("lendItems", JSON.stringify(items));
  });

  card.querySelector(".toggle-btn").addEventListener("click", () => {
    data.isLent = !data.isLent;
    updateItem(data);
    card.querySelector(".status").textContent = data.isLent ? "Lent" : "Available";
    card.querySelector(".toggle-btn").textContent = data.isLent ? "Mark as Available" : "Mark as Lent";
    card.classList.toggle("lent");
  });

  itemList.appendChild(card);
}

function updateItem(updatedItem) {
  const items = getItems().map(item => item.id === updatedItem.id ? updatedItem : item);
  localStorage.setItem("lendItems", JSON.stringify(items));
}
