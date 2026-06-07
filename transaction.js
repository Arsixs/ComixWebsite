// transaction.js - Checkout handling

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please log in to checkout.");
    window.location.href = "cart.html";
    return;
  }

  // Load and display cart items in order summary
  loadOrderSummary();

  // Handle payment method selection
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", handlePaymentMethodChange);
  });

  // Handle form submission
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }

  // Pre-fill user data if available
  prefillUserData(currentUser);
});

function prefillUserData(user) {
  // Pre-fill with user data if available
  if (user.email) document.getElementById("email").value = user.email;
  if (user.username) document.getElementById("fullName").value = user.username;
  if (user.phone) document.getElementById("phone").value = user.phone;
}

function handlePaymentMethodChange(e) {
  const cardDetailsDiv = document.getElementById("cardDetailsDiv");
  const paymentMethod = e.target.value;

  // Show card details only for card payments
  if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card") {
    cardDetailsDiv.style.display = "block";
    document.getElementById("cardholderName").required = true;
    document.getElementById("cardNumber").required = true;
    document.getElementById("expiryDate").required = true;
    document.getElementById("cvv").required = true;
  } else {
    cardDetailsDiv.style.display = "none";
    document.getElementById("cardholderName").required = false;
    document.getElementById("cardNumber").required = false;
    document.getElementById("expiryDate").required = false;
    document.getElementById("cvv").required = false;
  }
}

function loadOrderSummary() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cartKey = "cart_" + (currentUser ? currentUser.username : "guest");
  const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

  if (cartItems.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Display cart items
  const orderItemsDiv = document.getElementById("orderItems");
  orderItemsDiv.innerHTML = cartItems.map(item => `
    <div class="order-item">
      <span>${item.title} x${item.quantity}</span>
      <span>₱${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join("");

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = (subtotal + shipping) * 0.1;
  const total = subtotal + shipping + tax;

  // Update summary
  document.getElementById("summarySubtotal").textContent = "₱" + subtotal.toFixed(2);
  document.getElementById("summarySipping").textContent = "₱" + shipping.toFixed(2);
  document.getElementById("summaryTax").textContent = "₱" + tax.toFixed(2);
  document.getElementById("summaryTotal").textContent = "₱" + total.toFixed(2);
}

function formatCardNumber(input) {
  // Format card number with spaces
  let value = input.value.replace(/\s/g, "");
  let formattedValue = "";
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) formattedValue += " ";
    formattedValue += value[i];
  }
  input.value = formattedValue;
}

function formatExpiryDate(input) {
  // Format expiry date MM/YY
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  input.value = value;
}

// Add formatting listeners
const cardNumberInput = document.getElementById("cardNumber");
if (cardNumberInput) {
  cardNumberInput.addEventListener("input", function() {
    formatCardNumber(this);
  });
}

const expiryDateInput = document.getElementById("expiryDate");
if (expiryDateInput) {
  expiryDateInput.addEventListener("input", function() {
    formatExpiryDate(this);
  });
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  // Validate form
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  // Validate required fields
  if (!fullName || !email || !phone || !address || !city || !postalCode || !state || !country) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate phone format
  if (!/^\d{10,}$/.test(phone.replace(/\D/g, ""))) {
    alert("Please enter a valid phone number.");
    return;
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Validate card details if credit/debit card
  if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card") {
    const cardholderName = document.getElementById("cardholderName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiryDate = document.getElementById("expiryDate").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      alert("Please fill in all card details.");
      return;
    }

    // Validate card number (basic validation)
    if (cardNumber.replace(/\s/g, "").length < 13) {
      alert("Please enter a valid card number.");
      return;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert("Expiry date must be in MM/YY format.");
      return;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
      alert("Please enter a valid CVV.");
      return;
    }
  }

  // Get current user and cart
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cartKey = "cart_" + (currentUser ? currentUser.username : "guest");
  const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = (subtotal + shipping) * 0.1;
  const total = subtotal + shipping + tax;

  // Create order object
  const order = {
    id: Date.now(),
    orderId: "ORD-" + Date.now(),
    user: currentUser.username,
    email: email,
    phone: phone,
    shippingAddress: {
      fullName: fullName,
      address: address,
      city: city,
      postalCode: postalCode,
      state: state,
      country: country
    },
    items: cartItems,
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    total: total,
    paymentMethod: paymentMethod,
    date: new Date().toLocaleString(),
    status: "Confirmed"
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem(cartKey);

  // Show success message
  showSuccessMessage(order.orderId);
}

function showSuccessMessage(orderId) {
  const checkoutContainer = document.getElementById("checkoutContainer");
  const successMessage = document.getElementById("successMessage");

  document.getElementById("orderId").textContent = orderId;

  checkoutContainer.style.display = "none";
  successMessage.style.display = "block";

  // Scroll to top
  window.scrollTo(0, 0);
}
