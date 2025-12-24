// Medication data (same as in place-order.js)
const medications = [
    { id: 1, name: "Aspirin 500mg", price: 4.99, description: "Pain reliever and fever reducer", image: "meds/aspirin.svg" },
    { id: 2, name: "Ibuprofen 200mg", price: 6.49, description: "Anti-inflammatory pain reliever", image: "meds/ibuprofen.svg" },
    { id: 3, name: "Paracetamol 500mg", price: 5.99, description: "Acetaminophen for pain and fever", image: "meds/paracetamol.svg" },
    { id: 4, name: "Vitamin C 1000mg", price: 7.99, description: "Immune support supplement", image: "meds/vitamin-c.svg" },
    { id: 5, name: "Cough Syrup", price: 8.49, description: "Effective cough suppressant", image: "meds/cough-syrup.svg" },
    { id: 6, name: "Antihistamine 10mg", price: 9.99, description: "Allergy relief medication", image: "meds/antihistamine.svg" }
];

// Cart state management
function getCart() {
    const cart = localStorage.getItem('gomedCart');
    return cart ? JSON.parse(cart) : {};
}

function saveCart(cart) {
    localStorage.setItem('gomedCart', JSON.stringify(cart));
}

function updateQuantity(medId, delta) {
    const cart = getCart();
    const currentQty = cart[medId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    if (newQty === 0) {
        delete cart[medId];
    } else {
        cart[medId] = newQty;
    }
    
    saveCart(cart);
    renderCart();
}

function removeItem(medId) {
    const cart = getCart();
    delete cart[medId];
    saveCart(cart);
    renderCart();
}

function calculateTotals() {
    const cart = getCart();
    let totalItems = 0;
    let totalPrice = 0;
    
    Object.entries(cart).forEach(([id, qty]) => {
        const med = medications.find(m => m.id == id);
        if (med) {
            totalItems += qty;
            totalPrice += med.price * qty;
        }
    });
    
    return { totalItems, totalPrice };
}

function renderCart() {
    const cart = getCart();
    const cartEntries = Object.entries(cart);
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');
    
    if (cartEntries.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    
    cartItems.innerHTML = cartEntries.map(([id, qty]) => {
        const med = medications.find(m => m.id == id);
        if (!med) return '';
        
        const subtotal = med.price * qty;
        
        return `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${med.name}</div>
                    <div class="item-price">$${med.price.toFixed(2)} each</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${med.id}, -1)">−</button>
                    <div class="qty-display">${qty}</div>
                    <button class="qty-btn" onclick="updateQuantity(${med.id}, 1)">+</button>
                </div>
                <div class="item-subtotal">
                    <div class="subtotal-price">$${subtotal.toFixed(2)}</div>
                </div>
                <button class="remove-btn" onclick="removeItem(${med.id})">🗑️ Remove</button>
            </div>
        `;
    }).join('');
    
    const { totalItems, totalPrice } = calculateTotals();
    document.getElementById('subtotal').textContent = totalPrice.toFixed(2);
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function proceedToCheckout() {
    const { totalItems, totalPrice } = calculateTotals();
    alert(`Proceeding to checkout!\n\nItems: ${totalItems}\nTotal: $${totalPrice.toFixed(2)}\n\nThis feature will be connected to payment processing.`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
