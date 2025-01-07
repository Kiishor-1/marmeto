document.addEventListener("DOMContentLoaded", () => {
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const placeOrderButton = document.getElementById("placeOrder");

    // Retrieve cart data from localStorage
    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

    // Render Order Summary
    function updateOrderSummary() {
        const subtotal = cartData.reduce((sum, item) => sum + item.line_price, 0);
        subtotalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
        totalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
    }

    // Clear Cart
    function clearCart() {
        cartData = [];
        localStorage.setItem("cartData", JSON.stringify(cartData));
        subtotalElement.textContent = "₹0.00";
        totalElement.textContent = "₹0.00";
        alert("Order placed successfully! Your cart is now empty.");
    }

    // Attach event listener to "Place Order" button
    placeOrderButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        clearCart();
    });

    // Initial render of order summary
    updateOrderSummary();
});