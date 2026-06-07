// profile.js - User Profile Management

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // Redirect if not logged in
  if (!currentUser) {
    alert("Please log in to view your profile.");
    window.location.href = "Comix.html";
    return;
  }
  
  // Load and display profile
  loadProfile(currentUser);
  
  // Handle profile picture upload
  const profilePictureInput = document.getElementById("profilePictureInput");
  if (profilePictureInput) {
    profilePictureInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const pictureData = event.target.result;
          
          // Update current user
          currentUser.profilePicture = pictureData;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          
          // Update all users in localStorage
          const users = JSON.parse(localStorage.getItem("users")) || [];
          const userIndex = users.findIndex(u => u.username === currentUser.username);
          if (userIndex !== -1) {
            users[userIndex].profilePicture = pictureData;
            localStorage.setItem("users", JSON.stringify(users));
          }
          
          // Update display
          document.getElementById("profilePictureDisplay").src = pictureData;
          document.getElementById("navProfilePicture").src = pictureData;
          alert("Profile picture updated successfully!");
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

function loadProfile(user) {
  // Display user details
  document.getElementById("profileUsername").textContent = user.username || "User";
  document.getElementById("profileEmail").textContent = user.email || "Not provided";
  document.getElementById("profilePhone").textContent = user.phone || "Not provided";
  document.getElementById("profileBirthDate").textContent = user.birthDate || "Not provided";
  document.getElementById("profileGender").textContent = user.gender || "Not provided";
  
  // Member since - use the date from first order or current date
  const memberSince = user.memberSince || new Date().toLocaleDateString();
  document.getElementById("profileMemberSince").textContent = memberSince;
  
  // Display profile picture
  if (user.profilePicture) {
    document.getElementById("profilePictureDisplay").src = user.profilePicture;
    document.getElementById("navProfilePicture").src = user.profilePicture;
  }
  
  // Load and display order history
  loadOrderHistory(user.username);
}

function loadOrderHistory(username) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = orders.filter(order => order.user === username);
  
  const container = document.getElementById("orderHistoryContainer");
  
  if (userOrders.length === 0) {
    container.innerHTML = '<div class="empty-message">No orders yet. Start shopping!</div>';
    return;
  }
  
  // Sort orders by date (newest first)
  userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = userOrders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">Order ${order.orderId}</div>
          <div class="order-date">${order.date}</div>
        </div>
        <div class="order-status">${order.status || "Confirmed"}</div>
      </div>
      
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <span>${item.title} x${item.quantity}</span>
            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join("")}
      </div>
      
      <div class="order-total">
        <span>Total:</span>
        <span>₱${order.total.toFixed(2)}</span>
      </div>
    </div>
  `).join("");
}
