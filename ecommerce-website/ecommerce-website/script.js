const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 3500, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Casual Sneakers", category: "Fashion", price: 2800, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Classic Backpack", category: "Fashion", price: 1800, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Modern Desk Lamp", category: "Home", price: 1500, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" },
  { id: 6, name: "Travel Coffee Mug", category: "Home", price: 900, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80" },
  { id: 7, name: "Digital Camera", category: "Electronics", price: 12000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
  { id: 8, name: "Stylish Sunglasses", category: "Fashion", price: 1200, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" }
];

const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutPanel = document.getElementById("checkoutPanel");
let searchTerm = "";
let selectedCategory = "all";

function formatPrice(amount) {
  return "KSh " + amount.toLocaleString("en-KE");
}

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  document.getElementById("resultMessage").textContent = `${filteredProducts.length} product(s) found`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>No products found. Try another search.</p>";
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy"
        onerror="this.style.display='none'">
      <div class="product-info">
        <p class="category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="add-button" data-add="${product.id}">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
  cartPanel.classList.add("open");
  checkoutPanel.classList.remove("open");
}

function renderCart() {
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach((quantity, productId) => {
    const product = products.find(item => item.id === productId);
    totalQuantity += quantity;
    totalPrice += product.price * quantity;
  });

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.size === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.innerHTML = [...cart.entries()].map(([productId, quantity]) => {
    const product = products.find(item => item.id === productId);
    return `
      <div class="cart-item">
        <div><h4>${product.name}</h4><p>${formatPrice(product.price * quantity)}</p></div>
        <div class="quantity-controls">
          <button data-decrease="${productId}" aria-label="Decrease ${product.name} quantity">−</button>
          <span>${quantity}</span>
          <button data-increase="${productId}" aria-label="Increase ${product.name} quantity">+</button>
          <button class="remove-button" data-remove="${productId}" aria-label="Remove ${product.name}">✕</button>
        </div>
      </div>
    `;
  }).join("");
}

document.addEventListener("click", event => {
  const target = event.target;
  if (target.dataset.add) addToCart(Number(target.dataset.add));

  if (target.dataset.increase) {
    const id = Number(target.dataset.increase);
    cart.set(id, cart.get(id) + 1);
    renderCart();
  }

  if (target.dataset.decrease) {
    const id = Number(target.dataset.decrease);
    const quantity = cart.get(id) - 1;
    if (quantity <= 0) cart.delete(id);
    else cart.set(id, quantity);
    renderCart();
  }

  if (target.dataset.remove) {
    cart.delete(Number(target.dataset.remove));
    renderCart();
  }
});

document.getElementById("cartButton").addEventListener("click", () => {
  cartPanel.classList.toggle("open");
  checkoutPanel.classList.remove("open");
  if (cartPanel.classList.contains("open")) {
    cartPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim();
  renderProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("categoryFilter").addEventListener("change", event => {
  selectedCategory = event.target.value;
  renderProducts();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Your shopping cart is empty!");
    return;
  }
  checkoutPanel.classList.add("open");
  checkoutPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("cancelCheckout").addEventListener("click", () => {
  checkoutPanel.classList.remove("open");
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  if (cart.size === 0) {
    alert("Your cart is empty.");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  if (!customerName) {
    alert("Please enter your name.");
    return;
  }

  const orderTotal = [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * quantity;
  }, 0);

  alert(`Demo order prepared successfully!\n\nCustomer: ${customerName}\nTotal: ${formatPrice(orderTotal)}\n\nThis is a demonstration only. No payment was taken and no order was saved to a server.`);
  cart.clear();
  renderCart();
  event.target.reset();
  checkoutPanel.classList.remove("open");
  cartPanel.classList.remove("open");
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
