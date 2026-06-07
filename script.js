// Modal handling
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const closeBtns = document.querySelectorAll(".close");
const userDisplay = document.getElementById("userDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const hero = document.getElementById("hero"); // May be null on product.html

// Load users from localStorage or initialize with admin
let users = JSON.parse(localStorage.getItem("users")) || [
  { username: "admin", password: "admin123", role: "admin", email: "admin@manhwahub.com" }
];

// Show user name and hide login/signup
function showUser(name, profilePicture = null) {
  if (userDisplay) {
    userDisplay.textContent = "Hello, " + name;
    userDisplay.style.display = "block";
  }
  if (loginBtn) loginBtn.style.display = "none";
  if (signupBtn) signupBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
  
  // Show account icon in navbar
  const accountIcon = document.getElementById("accountIcon");
  if (accountIcon) {
    accountIcon.style.display = "inline-block";
  }
  
  // Show profile picture
  const profilePictureNav = document.getElementById("profilePictureNav");
  const navProfilePicture = document.getElementById("navProfilePicture");
  if (profilePictureNav && navProfilePicture) {
    profilePictureNav.style.display = "block";
    if (profilePicture) {
      navProfilePicture.src = profilePicture;
    } else {
      navProfilePicture.src = "https://via.placeholder.com/40?text=Profile";
    }
    navProfilePicture.onclick = () => window.location.href = "profile.html";
  }
}

// Logout function
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem("currentUser");
    if (userDisplay) userDisplay.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
    const profilePictureNav = document.getElementById("profilePictureNav");
    if (profilePictureNav) profilePictureNav.style.display = "none";
    const accountIcon = document.getElementById("accountIcon");
    if (accountIcon) accountIcon.style.display = "none";
    alert("You have logged out.");
    window.location.href = "index.html";
  };
}

// Open modals
if (loginBtn) loginBtn.onclick = () => {
  if (loginModal) loginModal.style.display = "flex";
};
if (signupBtn) signupBtn.onclick = () => {
  if (signupModal) signupModal.style.display = "flex";
};
closeBtns.forEach(btn => btn.onclick = () => {
  if (loginModal) loginModal.style.display = "none";
  if (signupModal) signupModal.style.display = "none";
});

// Close modal when clicking outside
if (loginModal) {
  loginModal.onclick = (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
  };
}
if (signupModal) {
  signupModal.onclick = (e) => {
    if (e.target === signupModal) signupModal.style.display = "none";
  };
}

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !birthDate || !phone || !email || !password || !confirmPassword) {
      alert("All required fields must be filled!");
      return;
    }
    if (!/^\d{11}$/.test(phone)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (users.find(u => u.username === username)) {
      alert("Username already taken!");
      return;
    }

    users.push({ username, birthDate, gender, phone, email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    if (signupModal) signupModal.style.display = "none";
    signupForm.reset();
  };
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (user.role === "admin") {
        alert("Welcome Admin! Redirecting to dashboard...");
        window.location.href = "admin.html";
      } else {
        alert("Welcome " + user.username + "!");
        showUser(user.username, user.profilePicture);
        if (loginModal) loginModal.style.display = "none";
        loginForm.reset();
      }
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };
}

// Restore session
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
  showUser(currentUser.username);
  if (currentUser.role === "admin") {
    const adminLink = document.getElementById("adminLink");
    if (adminLink) adminLink.style.display = "inline-block";
  }
}

// Hero slideshow - Load from localStorage or use default images
const defaultHeroImages = [
  "https://m.media-amazon.com/images/S/pv-target-images/6edf195986bcb6b666d294f4687b736e8b590b94bc5e4bf6da638809da6f46b8.jpg",
  "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/04/solo-leveling-manhwa.jpg",
  "https://1.bp.blogspot.com/-Kf1wjQ4K92Y/X_Fyk5M5GfI/AAAAAAAACDc/m7z2mm07ZxUDT9UOiSzsJJeB_P0iM0dSQCNcBGAsYHQ/s1600/1.jpg"
];

// Load custom hero images from localStorage, fallback to defaults
let storedHeroImages = JSON.parse(localStorage.getItem("heroImages")) || [];
let heroImages = storedHeroImages.length > 0 
  ? storedHeroImages.map(h => h.image) 
  : defaultHeroImages;

let currentImage = 0;
function changeHeroBackground() {
  if (hero) {
    hero.style.backgroundImage = `linear-gradient(to right, rgba(15,15,15,0.7), rgba(24,24,24,0.7)), url('${heroImages[currentImage]}')`;
    currentImage = (currentImage + 1) % heroImages.length;
  }
}
if (hero) {
  changeHeroBackground();
  setInterval(changeHeroBackground, 5000);
}

// Leaderboard - Dynamic calculation based on orders
function loadLeaderboard() {
  const list = document.querySelector(".leaderboard-list");
  if (!list) return;

  // Get all orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  
  // Count purchases per book
  const bookSales = {};
  allOrders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        if (!bookSales[item.id]) {
          bookSales[item.id] = { id: item.id, title: item.title, sales: 0 };
        }
        bookSales[item.id].sales += item.quantity;
      });
    }
  });

  // Convert to array and sort by sales
  const leaderboardData = Object.values(bookSales)
    .sort((a, b) => b.sales - a.sales);

  // Render leaderboard
  list.innerHTML = "";
  leaderboardData.forEach((item, index) => {
    const li = document.createElement("li");
    const rankLabel = index === 0 ? "🥇 Top 1" : index === 1 ? "🥈 Top 2" : index === 2 ? "🥉 Top 3" : `Top ${index + 1}`;
    li.innerHTML = `
      <span class="rank">${rankLabel}</span>
      <span class="title">${item.title}</span>
      <span class="score">${item.sales} ${item.sales === 1 ? 'Purchase' : 'Purchases'}</span>
    `;
    list.appendChild(li);
  });
}

// Load leaderboard when page is ready
document.addEventListener("DOMContentLoaded", loadLeaderboard);

// ✅ Load books from localStorage and from any available JSON data file
let books = [];

// Load from localStorage first (synchronously)
const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
books = storedBooks;

function fetchBookData() {
  return fetch("books.json")
    .then(res => res.json())
    .catch(() => fetch("Books.json").then(res => res.json()))
    .catch(() => fetch("Store.json").then(res => res.json()));
}

function initializeBooks() {
  // If we already have books in localStorage, render them immediately
  if (books.length > 0) {
    console.log("Books already loaded from localStorage:", books.length);
    renderStoreBooks();
    renderLibraryBooks();
    renderGenreBooks();
    renderPopularBooks();
    loadProductDetail();
  }
  
  // Then try to fetch and merge JSON data
  fetchBookData()
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        console.log("Loaded additional books from JSON:", data.length);
        data.forEach(b => {
          if (!b.id) b.id = Date.now() + Math.floor(Math.random() * 1000);
        });
        books = [...data, ...storedBooks];
        localStorage.setItem("books", JSON.stringify(books));
        // Re-render with merged data
        renderStoreBooks();
        renderLibraryBooks();
        renderGenreBooks();
        renderPopularBooks();
        loadProductDetail();
      }
    })
    .catch(err => {
      console.log("Book JSON load failed; using localStorage data only.", err);
      // Books already set to storedBooks above, re-render to be sure
      if (books.length === 0) {
        console.log("No books found anywhere");
        renderStoreBooks();
      }
      // Always render genres even if no books
      renderGenreBooks();
    });
}

initializeBooks();

// Ensure genres are always rendered, even if on genre.html with no books
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (document.querySelector('.genre-grid') && document.querySelector('.genre-grid').children.length === 0) {
      renderGenreBooks();
    }
  }, 500);
});

function renderStoreBooks() {
  const bookGrid = document.querySelector(".book-grid");
  if (!bookGrid) return;

  bookGrid.innerHTML = "";

  if (!books || books.length === 0) {
    bookGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>No products are currently available.</p>";
    return;
  }

  books.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="genre">${book.genre}</p>
        <p class="price">₱${parseFloat(book.price).toFixed(2)}</p>
        <button class="cart-btn" onclick="event.stopPropagation(); addToCartFromStore(event, ${book.id})">Add to Cart</button>
      </div>
    `;

    // Make card clickable
    card.addEventListener("click", () => {
      window.location.href = "product.html?id=" + book.id;
    });

    bookGrid.appendChild(card);
  });
}

function addToCartFromStore(event, bookId) {
  event.stopPropagation();
  const book = books.find(b => b.id == bookId);
  if (book && typeof cart !== 'undefined') {
    cart.addItem(book, 1);
    alert(book.title + " added to cart!");
  }
}

function renderLibraryBooks() {
  const grid = document.querySelector(".library-grid");
  if (!grid) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  if (!currentUser) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>Please log in to view your library.</p>";
    return;
  }

  // Get all orders for current user
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = allOrders.filter(order => order.user === currentUser.username);

  // Extract purchased book IDs
  const purchasedBookIds = new Set();
  userOrders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        purchasedBookIds.add(item.id);
      });
    }
  });

  // Filter books to only include purchased ones
  const purchasedBooks = books.filter(book => purchasedBookIds.has(book.id));

  if (purchasedBooks.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>You haven't purchased any books yet. Visit the store to add books to your library!</p>";
    return;
  }

  grid.innerHTML = purchasedBooks.map(book => `
    <div class="library-card">
      <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
      <div class="library-info">
        <h3>${book.title}</h3>
        <p>${book.genre}</p>
        <button class="read-btn" onclick="window.location.href='product.html?id=${book.id}'">Read</button>
      </div>
    </div>
  `).join("");
}

function renderGenreBooks() {
  const grid = document.querySelector(".genre-grid");
  if (!grid) return;

  // Load genres from localStorage
  const storedGenres = JSON.parse(localStorage.getItem("genres")) || [];

  // Default genres if none stored
  const defaultGenres = [
    { id: 1, name: "Action", description: "Intense battles and thrilling adventures", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
    { id: 2, name: "Fantasy", description: "Magical worlds and epic quests", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400" },
    { id: 3, name: "Romance", description: "Heartwarming love stories", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400" },
    { id: 4, name: "Adventure", description: "Epic journeys and discoveries", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400" }
  ];

  // Load deleted genre IDs to hide them
  const deletedGenreIds = JSON.parse(localStorage.getItem("deletedGenreIds")) || [];
  
  // Filter out deleted default genres
  const availableDefaultGenres = defaultGenres.filter(g => !deletedGenreIds.includes(g.id));
  
  // Combine default genres with custom stored genres
  const allGenres = [...availableDefaultGenres, ...storedGenres];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser && currentUser.role === "admin";

  // Show add button only for admins
  const addBtn = document.getElementById("addGenreBtn");
  if (addBtn) {
    addBtn.style.display = isAdmin ? "inline-block" : "none";
  }

  grid.innerHTML = allGenres.map(genre => `
    <div class="genre-card" style="cursor: pointer;">
      <img src="${genre.image}" alt="${genre.name}" style="width: 100%; height: 250px; object-fit: cover;" onclick="toggleGenreSelection('${genre.name}')">
      <div class="genre-info">
        <h3 onclick="toggleGenreSelection('${genre.name}')" style="cursor: pointer;">${genre.name}</h3>
        <p>${genre.description}</p>
        <button class="genre-btn" onclick="toggleGenreSelection('${genre.name}')">Explore</button>
        ${isAdmin ? `
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button class="genre-edit-btn" onclick="editGenre(${genre.id})">Edit</button>
            <button class="genre-delete-btn" onclick="deleteGenre(${genre.id})">Delete</button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join("");
}

let activeGenreFilters = [];

function toggleGenreSelection(genreName) {
  // ensure filtered view visible
  const genresSection = document.querySelector('.genres');
  const filteredSection = document.querySelector('.filtered-books');
  if (genresSection && filteredSection) {
    genresSection.style.display = 'none';
    filteredSection.style.display = 'block';
  }

  // toggle selection (case-insensitive)
  const idx = activeGenreFilters.findIndex(f => f.toLowerCase() === genreName.toLowerCase());
  if (idx === -1) activeGenreFilters.push(genreName);
  else activeGenreFilters.splice(idx, 1);

  renderGenreFilterTags();
  renderFilteredBooks();
}

// Backwards-compatible alias for any old inline handlers
function filterByGenre(genreName) {
  toggleGenreSelection(genreName);
}


function renderGenreFilterTags() {
  const tagsContainer = document.getElementById('genreFilterTags');
  if (!tagsContainer) return;
  tagsContainer.innerHTML = '';

  activeGenreFilters.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'genre-filter-tag';
    btn.textContent = g + ' ×';
    btn.onclick = (e) => {
      e.stopPropagation();
      activeGenreFilters = activeGenreFilters.filter(x => x.toLowerCase() !== g.toLowerCase());
      renderGenreFilterTags();
      renderFilteredBooks();
    };
    tagsContainer.appendChild(btn);
  });

  // Update clear filter button visibility
  const clearBtn = document.getElementById('clearFilterBtn');
  if (clearBtn) clearBtn.style.display = activeGenreFilters.length > 0 ? 'inline-block' : 'none';
}

function renderFilteredBooks() {
  const bookGrid = document.querySelector('.filtered-book-grid');
  const titleEl = document.getElementById('filteredGenreTitle');
  if (!bookGrid || !titleEl) return;

  if (activeGenreFilters.length === 0) {
    // No filters - go back to genre list
    document.querySelector('.filtered-books').style.display = 'none';
    document.querySelector('.genres').style.display = 'block';
    return;
  }

  titleEl.textContent = activeGenreFilters.join(' + ') + ' Books';

  // OR filter: include books that match any selected genre
  const filteredBooks = books.filter(b => activeGenreFilters.some(f => b.genre && b.genre.toLowerCase().includes(f.toLowerCase())));

  bookGrid.innerHTML = '';
  if (filteredBooks.length === 0) {
    bookGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>No books found for selected genres.</p>";
    return;
  }

  filteredBooks.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'" style="cursor: pointer;">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="genre">${book.genre}</p>
        <p class="price">₱${parseFloat(book.price || 0).toFixed(2)}</p>
        <button class="cart-btn" onclick="event.stopPropagation(); addToCartFromStore(event, ${book.id})">Add to Cart</button>
      </div>
    `;
    card.addEventListener('click', () => window.location.href = 'product.html?id=' + book.id);
    bookGrid.appendChild(card);
  });
}

// Clear filter button
const clearFilterBtn = document.getElementById('clearFilterBtn');
if (clearFilterBtn) {
  clearFilterBtn.onclick = () => {
    activeGenreFilters = [];
    renderGenreFilterTags();
    renderFilteredBooks();
  };
}

function renderPopularBooks() {
  const grid = document.querySelector(".popular .book-grid");
  if (!grid) return;

  grid.innerHTML = books.slice(0, 4).map(book => `
    <div class="book-card">
      <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="genre">${book.genre}</p>
        <p class="price">₱${parseFloat(book.price).toFixed(2)}</p>
        <button class="buy-btn" onclick="window.location.href='product.html?id=${book.id}'">View Details</button>
      </div>
    </div>
  `).join("");
}

// --- PRODUCT DETAIL PAGE HANDLING ---
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  console.log("Loading product detail - bookId:", bookId, "type:", typeof bookId);
  console.log("Available books:", books);

  if (bookId && document.getElementById("productTitle")) {
    // Convert bookId to number for consistent comparison
    const numBookId = parseInt(bookId, 10);
    const book = books.find(b => parseInt(b.id, 10) === numBookId);
    console.log("Found book:", book);
    
    if (book) {
      document.getElementById("productTitle").textContent = book.title;
      document.getElementById("productPrice").textContent = "₱" + parseFloat(book.price).toFixed(2);
      document.getElementById("productCover").src = book.cover;
      document.getElementById("productCover").onerror = function() {
        this.src = 'https://via.placeholder.com/250x350?text=No+Image';
      };
      document.getElementById("productDescription").textContent = book.description || "No description available";
      document.getElementById("productGenre").textContent = "Genre: " + book.genre;

      const addCartBtn = document.getElementById("addCartBtn");
      if (addCartBtn) {
        addCartBtn.onclick = () => {
          if (typeof cart === 'undefined') {
            alert("Cart system not initialized. Please refresh.");
            return;
          }
          
          const qty = parseInt(document.getElementById("quantity").value, 10) || 1;
          cart.addItem(book, qty);

          // Feedback
          const originalText = addCartBtn.textContent;
          addCartBtn.textContent = "Added ✓";
          addCartBtn.disabled = true;
          setTimeout(() => {
            addCartBtn.textContent = originalText;
            addCartBtn.disabled = false;
          }, 2000);

          alert(book.title + " added to cart!");
        };
      }

      // Handle checkout button
      const checkoutBtn = document.querySelector(".buy-btn");
      if (checkoutBtn) {
        checkoutBtn.onclick = () => {
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          if (!currentUser) {
            alert("Please log in first.");
            if (loginBtn) loginBtn.click();
            return;
          }
          if (typeof cart !== 'undefined') {
            const qty = parseInt(document.getElementById("quantity").value, 10) || 1;
            cart.addItem(book, qty);
            window.location.href = "cart.html";
          }
        };
      }
    } else {
      const detailSection = document.querySelector(".product-detail");
      if (detailSection) detailSection.innerHTML = "<p>Product not found.</p>";
    }
  }
}

// Call on page load
document.addEventListener("DOMContentLoaded", loadProductDetail);

// --- ADMIN PRODUCT EDITING ---
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const adminEditSection = document.getElementById("adminEditSection");
  
  // Show edit button only for admins
  if (adminEditSection && currentUser && currentUser.role === "admin") {
    adminEditSection.style.display = "block";
  }

  // Edit button handler
  const editProductBtn = document.getElementById("editProductBtn");
  if (editProductBtn) {
    editProductBtn.onclick = () => {
      const editForm = document.getElementById("editForm");
      if (editForm.style.display === "none") {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get("id");
        const numBookId = parseInt(bookId, 10);
        const book = books.find(b => parseInt(b.id, 10) === numBookId);
        
        if (book) {
          document.getElementById("editGenre").value = book.genre || "";
          document.getElementById("editPrice").value = book.price || "";
          document.getElementById("editDescription").value = book.description || "";
          editForm.style.display = "block";
        }
      } else {
        document.getElementById("editForm").style.display = "none";
      }
    };
  }

  // Cancel edit handler
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.onclick = () => {
      document.getElementById("editForm").style.display = "none";
    };
  }

  // Save changes handler
  const saveProductBtn = document.getElementById("saveProductBtn");
  if (saveProductBtn) {
    saveProductBtn.onclick = () => {
      const params = new URLSearchParams(window.location.search);
      const bookId = params.get("id");
      const numBookId = parseInt(bookId, 10);
      const bookIndex = books.findIndex(b => parseInt(b.id, 10) === numBookId);
      
      if (bookIndex !== -1) {
        const newGenre = document.getElementById("editGenre").value.trim();
        const newPrice = parseFloat(document.getElementById("editPrice").value);
        const newDescription = document.getElementById("editDescription").value.trim();

        if (!newGenre || isNaN(newPrice) || newPrice < 0 || !newDescription) {
          alert("Please fill in all fields with valid values.");
          return;
        }

        // Update book in memory
        books[bookIndex].genre = newGenre;
        books[bookIndex].price = newPrice;
        books[bookIndex].description = newDescription;

        // Save to localStorage
        localStorage.setItem("books", JSON.stringify(books));

        // Reload product detail to show changes
        document.getElementById("productGenre").textContent = "Genre: " + newGenre;
        document.getElementById("productPrice").textContent = "₱" + newPrice.toFixed(2);
        document.getElementById("productDescription").textContent = newDescription;

        // Hide edit form
        document.getElementById("editForm").style.display = "none";
        alert("Product updated successfully!");
      }
    };
  }
});

// Search functionality
const searchBox = document.querySelector(".search-box");
if (searchBox) {
  searchBox.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const bookGrid = document.querySelector(".book-grid");
    
    if (!bookGrid) return;

    if (query.length === 0) {
      renderStoreBooks();
      return;
    }

    const filtered = books.filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.genre.toLowerCase().includes(query)
    );

    bookGrid.innerHTML = "";
    if (filtered.length === 0) {
      bookGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>No books found.</p>";
      return;
    }

    filtered.forEach(book => {
      const card = document.createElement("div");
      card.classList.add("book-card");
      card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
        <div class="book-info">
          <h3>${book.title}</h3>
          <p class="genre">${book.genre}</p>
          <p class="price">₱${parseFloat(book.price).toFixed(2)}</p>
          <button class="cart-btn" onclick="event.stopPropagation(); addToCartFromStore(event, ${book.id})">Add to Cart</button>
        </div>
      `;
      card.addEventListener("click", () => {
        window.location.href = "product.html?id=" + book.id;
      });
      bookGrid.appendChild(card);
    });
  });
}

// --- GENRE MANAGEMENT ---
// Genre image preview
const genreImageInput = document.getElementById("genreImage");
if (genreImageInput) {
  genreImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("genrePreviewImg").src = event.target.result;
        document.getElementById("genreImagePreview").style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      document.getElementById("genreImagePreview").style.display = "none";
    }
  });
}

// Genre form submission
const addGenreForm = document.getElementById("addGenreForm");
if (addGenreForm) {
  addGenreForm.onsubmit = (e) => {
    e.preventDefault();
    const genreEditId = document.getElementById("genreEditId").value;
    const genreName = document.getElementById("genreName").value.trim();
    const genreDescription = document.getElementById("genreDescription").value.trim();
    const fileInput = document.getElementById("genreImage");
    const storedGenres = JSON.parse(localStorage.getItem("genres")) || [];
    
    if (genreEditId) {
      // Edit mode
      const genreIndex = storedGenres.findIndex(g => g.id == genreEditId);
      if (genreIndex !== -1) {
        storedGenres[genreIndex].name = genreName;
        storedGenres[genreIndex].description = genreDescription;
        
        // Update image if new one selected
        if (fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            storedGenres[genreIndex].image = event.target.result;
            localStorage.setItem("genres", JSON.stringify(storedGenres));
            alert("Genre updated successfully!");
            closeGenreModal();
            addGenreForm.reset();
            renderGenreBooks();
          };
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          localStorage.setItem("genres", JSON.stringify(storedGenres));
          alert("Genre updated successfully!");
          closeGenreModal();
          addGenreForm.reset();
          renderGenreBooks();
        }
      }
    } else {
      // Add mode
      const file = fileInput.files[0];
      
      if (!file) {
        alert("Please select an image for the genre.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const newGenre = {
          id: Date.now(),
          name: genreName,
          description: genreDescription,
          image: event.target.result
        };

        storedGenres.push(newGenre);
        localStorage.setItem("genres", JSON.stringify(storedGenres));

        alert("Genre added successfully!");
        addGenreForm.reset();
        document.getElementById("genreImagePreview").style.display = "none";
        closeGenreModal();
        
        // Re-render genres
        renderGenreBooks();
      };
      reader.readAsDataURL(file);
    }
  };
}

// Add Genre button handler
const addGenreBtn = document.getElementById("addGenreBtn");
if (addGenreBtn) {
  addGenreBtn.onclick = () => openGenreModal();
}

// Close modal when clicking outside
const genreModal = document.getElementById("genreModal");
if (genreModal) {
  genreModal.onclick = (e) => {
    if (e.target === genreModal) {
      closeGenreModal();
    }
  };
}

//  GENRE MANAGEMENT MODAL FUNCTIONS
function openGenreModal() {
  const modal = document.getElementById("genreModal");
  if (modal) {
    modal.style.display = "flex";
    // Reset form for adding new genre
    document.getElementById("genreEditId").value = "";
    document.getElementById("addGenreForm").reset();
    document.getElementById("genreImagePreview").style.display = "none";
    document.getElementById("modalTitle").textContent = "Add New Genre";
    document.getElementById("submitBtn").textContent = "Add Genre";
  }
}

function closeGenreModal() {
  const modal = document.getElementById("genreModal");
  if (modal) {
    modal.style.display = "none";
    document.getElementById("addGenreForm").reset();
    document.getElementById("genreImagePreview").style.display = "none";
  }
}

function editGenre(genreId) {
  const storedGenres = JSON.parse(localStorage.getItem("genres")) || [];
  
  // Default genres
  const defaultGenres = [
    { id: 1, name: "Action", description: "Intense battles and thrilling adventures", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
    { id: 2, name: "Fantasy", description: "Magical worlds and epic quests", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400" },
    { id: 3, name: "Romance", description: "Heartwarming love stories", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400" },
    { id: 4, name: "Adventure", description: "Epic journeys and discoveries", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400" }
  ];
  
  // Check stored genres first, then default genres
  let genre = storedGenres.find(g => g.id == genreId);
  if (!genre) {
    genre = defaultGenres.find(g => g.id == genreId);
  }
  
  if (genre) {
    try {
      // Populate form with existing data
      document.getElementById("genreEditId").value = genre.id;
      document.getElementById("genreName").value = genre.name;
      document.getElementById("genreDescription").value = genre.description;
      
      // Show existing image preview
      if (genre.image) {
        document.getElementById("genrePreviewImg").src = genre.image;
        document.getElementById("genreImagePreview").style.display = "block";
      }
      
      // Update modal title and button
      document.getElementById("modalTitle").textContent = "Edit Genre";
      document.getElementById("submitBtn").textContent = "Update Genre";
      
      // Clear file input and open modal
      document.getElementById("genreImage").value = "";
      const modal = document.getElementById("genreModal");
      if (modal) {
        modal.style.display = "flex";
      }
    } catch (e) {
      console.error("Error opening edit modal:", e);
      alert("Error opening edit dialog: " + e.message);
    }
  }
}

function deleteGenre(genreId) {
  if (confirm("Are you sure you want to delete this genre?")) {
    try {
      const storedGenres = JSON.parse(localStorage.getItem("genres")) || [];
      const deletedGenreIds = JSON.parse(localStorage.getItem("deletedGenreIds")) || [];
      
      // Check if it's a custom genre (in storedGenres)
      const customGenreIndex = storedGenres.findIndex(g => g.id == genreId);
      if (customGenreIndex !== -1) {
        // Delete custom genre
        storedGenres.splice(customGenreIndex, 1);
        localStorage.setItem("genres", JSON.stringify(storedGenres));
      } else {
        // It's a default genre - add its ID to deleted list
        if (!deletedGenreIds.includes(genreId)) {
          deletedGenreIds.push(genreId);
          localStorage.setItem("deletedGenreIds", JSON.stringify(deletedGenreIds));
        }
      }
      
      alert("Genre deleted successfully!");
      renderGenreBooks();
    } catch (e) {
      console.error("Error deleting genre:", e);
      alert("Error deleting genre: " + e.message);
    }
  }
}
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}