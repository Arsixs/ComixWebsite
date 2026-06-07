// admin.js

const logoutBtn = document.getElementById("logoutBtn");
const hero = document.getElementById("hero");

// ✅ Role check: only allow admins
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
  alert("Access denied. Redirecting to store...");
  window.location.href = "index.html";
} else {
  // Show admin info
  logoutBtn.style.display = "inline-block";
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay) {
    userDisplay.style.display = "block";
    userDisplay.textContent = "Hello, " + currentUser.username;
  }
  document.querySelector(".admin-dashboard").style.display = "block";
}

const addBookForm = document.getElementById("addBookForm");
const bookManager = document.getElementById("bookManager");
const fileInput = document.getElementById("bookCover");
const coverPreview = document.getElementById("coverPreview");
const previewImage = document.getElementById("previewImage");

// Show cover preview when file is selected
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.src = event.target.result;
      coverPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    coverPreview.style.display = "none";
  }
});

// Load existing books from localStorage, then from books.json
let books = JSON.parse(localStorage.getItem("books")) || [];

// Load from books.json and merge
fetch("books.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(b => {
    if (!b.id) b.id = Date.now() + Math.floor(Math.random() * 1000);
  });
    books = [...data, ...books];
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
  })
  .catch(err => {
    console.log("books.json not found");
    renderBooks();
  });

function renderBooks() {
  bookManager.innerHTML = "";
  books.forEach((book, index) => {
    const div = document.createElement("div");
    div.style.cssText = "background: #1a1a1a; padding: 15px; margin-bottom: 15px; border-radius: 8px; display: flex; gap: 15px; align-items: center;";
    div.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" style="width:80px;height:100px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/80x100?text=No+Image'">
      <div style="flex: 1;">
        <strong style="color: #00ffae;">${book.title}</strong><br>
        ${book.genre} - $${parseFloat(book.price).toFixed(2)}
      </div>
      <button onclick="deleteBook(${index})" style="background: #ff4444; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Delete</button>
    `;
    bookManager.appendChild(div);
  });
}

function deleteBook(index) {
  if (confirm("Are you sure you want to delete this book?")) {
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    alert("Book deleted!");
  }
}

addBookForm.onsubmit = (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("bookCover");
  const file = fileInput.files[0];
  
  if (!file) {
    alert("Please select a cover image.");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const newBook = {
      id: Date.now(), //  unique ID for product detail page
      title: document.getElementById("bookTitle").value,
      genre: document.getElementById("bookGenre").value,
      price: parseFloat(document.getElementById("bookPrice").value),
      cover: event.target.result, //  base64 encoded image
      description: document.getElementById("bookDescription").value,
      button: "Add to Cart"
    };
    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    addBookForm.reset();
    alert("Book added successfully!");
  };
  reader.readAsDataURL(file);
};
renderBooks();

// ✅ Logout handling
logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser"); // clear session
  alert("You have logged out.");
  window.location.href = "index.html"; // redirect back to store
};

//  Load users
let users = JSON.parse(localStorage.getItem("users")) || [];
const userManager = document.getElementById("userManager");
userManager.innerHTML = "<h3>Registered Users</h3>";
users.forEach(u => {
  const div = document.createElement("div");
  div.style.cssText = "background: #1a1a1a; padding: 12px; margin-bottom: 8px; border-radius: 5px; color: #cfcfcf;";
  div.textContent = `${u.username} (${u.role}) - ${u.email || 'No email'}`;
  userManager.appendChild(div);
});

//Load orders
let orders = JSON.parse(localStorage.getItem("orders")) || [];
const orderManager = document.getElementById("orderManager");
orderManager.innerHTML = "<h3>Recent Orders</h3>";
if (orders.length === 0) {
  const div = document.createElement("div");
  div.style.cssText = "padding: 15px; color: #888;";
  div.textContent = "No orders yet.";
  orderManager.appendChild(div);
} else {
  orders.slice(-10).reverse().forEach(order => {
    const div = document.createElement("div");
    div.style.cssText = "background: #1a1a1a; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #00ffae;";
    const itemsList = order.items && order.items.length > 0 ? order.items.map(i => `${i.title || 'Unknown'} x${i.quantity || 1}`).join(", ") : "No items";
    const orderDate = order.date ? new Date(order.date).toLocaleDateString() : "Unknown date";
    div.innerHTML = `
      <strong style="color: #00ffae; display: block; margin-bottom: 8px;">Order from ${order.user}</strong>
      <div style="color: #cfcfcf; margin-bottom: 6px;">Items: ${itemsList}</div>
      <div style="color: #888; font-size: 12px; margin-bottom: 6px;">Date: ${orderDate}</div>
      <strong style="color: #00ffae;">Total: ₱${(order.total || 0).toFixed(2)}</strong>
    `;
    orderManager.appendChild(div);
  });
}

// ✅ Reports/Analytics - Calculate properly
const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);

// Calculate top-selling book by quantity
let bookSales = {};
orders.forEach(order => {
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach(item => {
      if (!bookSales[item.id]) {
        bookSales[item.id] = { title: item.title, quantity: 0 };
      }
      bookSales[item.id].quantity += (item.quantity || 1);
    });
  }
});

let topBook = "None";
let topQuantity = 0;
for (let id in bookSales) {
  if (bookSales[id].quantity > topQuantity) {
    topQuantity = bookSales[id].quantity;
    topBook = bookSales[id].title;
  }
}

document.getElementById("totalSales").textContent = "₱" + totalSales.toFixed(2);
document.getElementById("topBook").textContent = topBook + (topQuantity > 0 ? ` (${topQuantity} sales)` : "");

// ✅ Hero slideshow
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("hero");
  if (!hero) {
    console.error("Hero element not found!");
    return;
  }

  const heroImages = [
    "https://m.media-amazon.com/images/S/pv-target-images/6edf195986bcb6b666d294f4687b736e8b590b94bc5e4bf6da638809da6f46b8.jpg",
  "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/04/solo-leveling-manhwa.jpg",
  "https://1.bp.blogspot.com/-Kf1wjQ4K92Y/X_Fyk5M5GfI/AAAAAAAACDc/m7z2mm07ZxUDT9UOiSzsJJeB_P0iM0dSQCNcBGAsYHQ/s1600/1.jpg"
  ];

  let currentImage = 0;

  function changeHeroBackground() {
    hero.style.backgroundImage =
      `linear-gradient(to right, rgba(15,15,15,0.7), rgba(24,24,24,0.7)), url('${heroImages[currentImage]}')`;
    currentImage = (currentImage + 1) % heroImages.length;
  }

  // Initial background
  changeHeroBackground();

  // Change every 5 seconds
  setInterval(changeHeroBackground, 5000);
});
