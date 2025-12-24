// Medication data
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
    renderMedications();
    updateCartCount();
    updateCartSummary();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = totalItems;
        countElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateCartSummary() {
    const cart = getCart();
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const med = medications.find(m => m.id == id);
        return sum + (med ? med.price * qty : 0);
    }, 0);
    
    const summaryElement = document.getElementById('cartSummary');
    const itemsElement = document.getElementById('summaryItems');
    const totalElement = document.getElementById('summaryTotal');
    
    if (totalItems > 0) {
        summaryElement.style.display = 'block';
        itemsElement.textContent = totalItems;
        totalElement.textContent = totalPrice.toFixed(2);
    } else {
        summaryElement.style.display = 'none';
    }
}

function renderMedications() {
    const cart = getCart();
    const grid = document.getElementById('medicationsGrid');
    
    grid.innerHTML = medications.map(med => {
        const quantity = cart[med.id] || 0;
        return `
            <div class="med-card">
                <img src="${med.image}" alt="${med.name}" class="med-image" onerror="this.src='meds/generic.svg'">
                <div class="med-info">
                    <div class="med-name">${med.name}</div>
                    <div class="med-description">${med.description}</div>
                    <div class="med-price-row">
                        <div class="med-price">$${med.price.toFixed(2)}</div>
                        <div class="med-quantity">${quantity}</div>
                    </div>
                    <div class="med-controls">
                        <button class="control-btn" onclick="updateQuantity(${med.id}, -1)" ${quantity === 0 ? 'disabled' : ''}>
                            − Remove
                        </button>
                        <button class="control-btn add" onclick="updateQuantity(${med.id}, 1)">
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderMedications();
    updateCartCount();
    updateCartSummary();
});
