// cart.js - Shopping Cart Management

class ShoppingCart {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.cartKey = "cart_" + (this.currentUser ? this.currentUser.username : "guest");
    this.cart = JSON.parse(localStorage.getItem(this.cartKey)) || [];
  }

  addItem(book, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === book.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: book.id,
        title: book.title,
        price: book.price,
        cover: book.cover,
        genre: book.genre,
        quantity: quantity
      });
    }
    
    this.saveCart();
  }

  removeItem(bookId) {
    this.cart = this.cart.filter(item => item.id !== bookId);
    this.saveCart();
  }

  updateQuantity(bookId, quantity) {
    const item = this.cart.find(i => i.id === bookId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      cartCount.textContent = this.getItemCount();
    }
  }
}

// Create global cart instance
const cart = new ShoppingCart();

// Update cart display on page load
document.addEventListener("DOMContentLoaded", () => {
  cart.updateCartDisplay();

  // If on cart.html, render cart items
  if (document.getElementById("cartItemsContainer")) {
    renderCartPage();
  }
});

function renderCartPage() {
  const container = document.getElementById("cartItemsContainer");
  const cartItems = cart.getCart();

  if (cartItems.length === 0) {
    container.parentElement.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart.</p>
        <a href="index.html" class="continue-shopping">Continue Shopping</a>
      </div>
    `;
    updateSummary();
    return;
  }

  container.innerHTML = cartItems.map(item => `
    <div class="cart-item" data-book-id="${item.id}">
      <img src="${item.cover}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/80x120?text=No+Image'">
      <div class="item-details">
        <h3>${item.title}</h3>
        <p>${item.genre}</p>
        <div class="item-price">₱${item.price.toFixed(2)}</div>
        
        <div class="quantity-control">
          <button onclick="decreaseQuantity(${item.id})">−</button>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
          <button onclick="increaseQuantity(${item.id})">+</button>
          <span style="margin-left: 20px; color: #00ffae;">₱${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join("");

  updateSummary();
}

function updateQuantity(bookId, newQuantity) {
  const quantity = parseInt(newQuantity) || 1;
  if (quantity > 0) {
    cart.updateQuantity(bookId, quantity);
    renderCartPage();
  }
}

function increaseQuantity(bookId) {
  const item = cart.cart.find(i => i.id === bookId);
  if (item) {
    cart.updateQuantity(bookId, item.quantity + 1);
    renderCartPage();
  }
}

function decreaseQuantity(bookId) {
  const item = cart.cart.find(i => i.id === bookId);
  if (item && item.quantity > 1) {
    cart.updateQuantity(bookId, item.quantity - 1);
    renderCartPage();
  }
}

function removeFromCart(bookId) {
  if (confirm("Are you sure you want to remove this item?")) {
    cart.removeItem(bookId);
    renderCartPage();
  }
}

function updateSummary() {
  const subtotal = cart.getTotal();
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = (subtotal + shipping) * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const shippingEl = document.getElementById("shipping");

  if (subtotalEl) subtotalEl.textContent = "₱" + subtotal.toFixed(2);
  if (taxEl) taxEl.textContent = "₱" + tax.toFixed(2);
  if (totalEl) totalEl.textContent = "₱" + total.toFixed(2);
  if (shippingEl) shippingEl.textContent = "₱" + shipping.toFixed(2);
}

// Checkout handler
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert("Please log in to checkout.");
        document.getElementById("loginBtn").click();
        return;
      }

      if (cart.getCart().length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Redirect to transaction page
      window.location.href = "transaction.html";
    };
  }
});
