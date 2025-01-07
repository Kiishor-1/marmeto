document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const fetchCartButton = document.getElementById("fetchCartButton"); 

    let cartData = [];


    async function fetchCartData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            cartData = data.items;
            saveCartData();
            renderCartItems();
            updateCartTotals();
            toggleFetchButton(); 
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    function saveCartData() {
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }

    // Render cart items
    function renderCartItems() {
        // Clear existing items but keep the header
        const existingItems = document.querySelectorAll(".cart-item");
        existingItems.forEach(item => item.remove());

        cartData.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <div class="cart-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <section class="cart-item-details">
                  <div>₹${item?.title}</div>
                  <div>₹${(item.price / 100).toFixed(2)}</div>
                  <div>
                      <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                  </div>
                  <div>₹${(item.line_price / 100).toFixed(2)}</div>
                </section>
                 <div>
                      <button class="remove-item" data-index="${index}">
                          <i class="fa-solid fa-trash"></i>
                      </button>
                  </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    function updateCartTotals() {
        const subtotal = cartData.reduce((sum, item) => sum + item.line_price, 0);
        subtotalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
        totalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
        saveCartData();
    }

    cartItemsContainer.addEventListener("input", (e) => {
        if (e.target.tagName === "INPUT") {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);
            cartData[index].quantity = newQuantity;
            cartData[index].line_price = cartData[index].price * newQuantity;
            renderCartItems();
            updateCartTotals();
        }
    });

    cartItemsContainer.addEventListener("click", (e) => {
        const button = e.target.closest(".remove-item");
        if (button) {
            const index = button.dataset.index;
            cartData.splice(index, 1);
            renderCartItems();
            updateCartTotals();
            toggleFetchButton(); 
        }
    });

    // Load cart data from localStorage
    const savedCartData = localStorage.getItem("cartData");
    if (savedCartData) {
        cartData = JSON.parse(savedCartData);
        renderCartItems();
        updateCartTotals();
        toggleFetchButton();
    } else {
        fetchCartData();
    }

    fetchCartButton.addEventListener("click", () => {
        fetchCartData();
    });
    function toggleFetchButton() {
        if (cartData.length === 0) {
            fetchCartButton.style.display = "block"; 
        } else {
            fetchCartButton.style.display = "none";
        }
    }
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".nav");

    hamburgerMenu.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
});


document.getElementById("checkout").addEventListener("click", () => {
    const total = document.getElementById("total").textContent.replace("₹", "").trim();
    localStorage.setItem("cartTotal", total);
    window.location.href = "checkout.html";
});