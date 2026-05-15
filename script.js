// ==================== PRODUCTS DATA ====================
const products = [
    {
        id: 1,
        name: "Luxury King Bed",
        category: "king",
        price: 899.99,
        originalPrice: 1199.99,
        image: "🛏️",
        rating: 4.5,
        reviews: 128,
        description: "Experience ultimate luxury with our premium King-size bed. Features ergonomic design, premium materials, and exceptional durability.",
        sizes: ["Twin", "Full", "Queen", "King"],
        colors: ["Brown", "Black", "Gray", "White"],
        inStock: true,
        badge: "50% OFF"
    },
    {
        id: 2,
        name: "Queen Comfort Bed",
        category: "queen",
        price: 649.99,
        originalPrice: 899.99,
        image: "🛏️",
        rating: 4.8,
        reviews: 95,
        description: "Perfect for couples, this Queen-size bed offers exceptional comfort with premium memory foam and orthopedic support.",
        sizes: ["Twin", "Full", "Queen", "King"],
        colors: ["Brown", "Black", "Gray", "White"],
        inStock: true,
        badge: "35% OFF"
    },
    {
        id: 3,
        name: "Single Steel Bed",
        category: "single",
        price: 349.99,
        originalPrice: 499.99,
        image: "🛏️",
        rating: 4.3,
        reviews: 67,
        description: "Durable and compact single bed, ideal for bedrooms and guest rooms. Built with high-grade steel framework.",
        sizes: ["Twin", "Full"],
        colors: ["Brown", "Black", "Gray"],
        inStock: true,
        badge: "30% OFF"
    },
    {
        id: 4,
        name: "Double Premium Bed",
        category: "double",
        price: 549.99,
        originalPrice: 799.99,
        image: "🛏️",
        rating: 4.6,
        reviews: 112,
        description: "Spacious and elegant double bed with superior comfort. Features advanced suspension system and hypoallergenic materials.",
        sizes: ["Full", "Queen", "King"],
        colors: ["Brown", "Black", "Gray", "White"],
        inStock: true,
        badge: "45% OFF"
    },
    {
        id: 5,
        name: "Eco King Bed",
        category: "king",
        price: 1099.99,
        originalPrice: 1499.99,
        image: "🛏️",
        rating: 5.0,
        reviews: 89,
        description: "Environmentally friendly King bed made from sustainable materials. Zero VOC emissions and fully recyclable.",
        sizes: ["Queen", "King"],
        colors: ["Brown", "Gray", "White"],
        inStock: true,
        badge: "NEW"
    },
    {
        id: 6,
        name: "Classic Single Bed",
        category: "single",
        price: 299.99,
        originalPrice: 449.99,
        image: "🛏️",
        rating: 4.2,
        reviews: 54,
        description: "Timeless design meets modern comfort. This single bed is perfect for any bedroom style and offers excellent value.",
        sizes: ["Twin", "Full"],
        colors: ["Brown", "Black", "Gray"],
        inStock: true,
        badge: "35% OFF"
    },
    {
        id: 7,
        name: "Platform Queen Bed",
        category: "queen",
        price: 749.99,
        originalPrice: 999.99,
        image: "🛏️",
        rating: 4.7,
        reviews: 103,
        description: "Modern platform style Queen bed with minimalist design. Offers excellent support and contemporary aesthetics.",
        sizes: ["Full", "Queen", "King"],
        colors: ["Black", "Gray", "White"],
        inStock: true,
        badge: "25% OFF"
    },
    {
        id: 8,
        name: "Storage Double Bed",
        category: "double",
        price: 699.99,
        originalPrice: 999.99,
        image: "🛏️",
        rating: 4.4,
        reviews: 78,
        description: "Double bed with built-in storage drawers. Perfect for small spaces needing extra storage functionality.",
        sizes: ["Full", "Queen"],
        colors: ["Brown", "Black", "Gray"],
        inStock: true,
        badge: "30% OFF"
    }
];

// ==================== GLOBAL VARIABLES ====================
let cart = [];
let wishlist = [];
let currentProduct = null;
let currentFilter = 'all';

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadWishlist();
    displayProducts();
    setupEventListeners();
});

// ==================== PRODUCT DISPLAY ====================
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    let filteredProducts = products;
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(p => p.category === currentFilter);
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            ${product.image}
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">
                ${generateStars(product.rating)}
                <span>(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current">$${product.price.toFixed(2)}</span>
                <span class="original">$${product.originalPrice.toFixed(2)}</span>
            </div>
            <div class="product-actions">
                <button class="quick-view-btn" onclick="openModal(${product.id})">Quick View</button>
                <button class="wishlist-btn-small" onclick="addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// ==================== FILTER PRODUCTS ====================
function filterProducts(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts();
}

// ==================== MODAL FUNCTIONS ====================
function openModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) return;

    document.getElementById('modalTitle').textContent = currentProduct.name;
    document.getElementById('modalDescription').textContent = currentProduct.description;
    document.getElementById('modalPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('modalOriginal').textContent = `$${currentProduct.originalPrice.toFixed(2)}`;
    document.getElementById('productModal').classList.add('active');

    // Fill size select
    const sizeSelect = document.getElementById('sizeSelect');
    sizeSelect.innerHTML = '<option>Select Size</option>';
    currentProduct.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    // Reset quantity
    document.getElementById('quantityInput').value = 1;

    // Draw 3D bed visualization
    draw3DBed();
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    currentProduct = null;
}

function draw3DBed() {
    const canvas = document.getElementById('productCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw 3D bed
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 20, 80, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#A0522D';
    ctx.fillRect(centerX - 80, centerY - 15, 160, 80);

    // Draw pillows
    ctx.fillStyle = '#D3D3D3';
    ctx.beginPath();
    ctx.arc(centerX - 50, centerY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 50, centerY - 10, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Add animation
    requestAnimationFrame(() => draw3DBed());
}

// ==================== QUANTITY SELECTOR ====================
function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ==================== COLOR SELECTOR ====================
function selectColor(element) {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.remove('selected');
    });
    element.classList.add('selected');
}

// ==================== ADD TO CART ====================
function addToCart() {
    if (!currentProduct) return;

    const sizeSelect = document.getElementById('sizeSelect');
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const selectedColor = document.querySelector('.color-swatch.selected');

    if (sizeSelect.value === 'Select Size') {
        alert('Please select a size');
        return;
    }

    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        size: sizeSelect.value,
        color: selectedColor ? selectedColor.style.backgroundColor : '#8B4513',
        quantity: quantity
    };

    // Check if item already in cart
    const existingItem = cart.find(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(cartItem);
    }

    saveCart();
    updateCartCount();
    closeModal();
    showNotification(`${currentProduct.name} added to cart!`);
}

// ==================== CART FUNCTIONS ====================
function toggleCart(event) {
    if (event) {
        event.preventDefault();
    }
    document.getElementById('cartSidebar').classList.toggle('active');
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartSummary();
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${getProductEmoji(item.id)}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div style="font-size: 0.85rem; color: #666;">
                    ${item.size} | <span style="display: inline-block; width: 15px; height: 15px; background-color: ${item.color}; border-radius: 3px;"></span>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="decreaseCartItemQuantity(${index})">-</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button onclick="increaseCartItemQuantity(${index})">+</button>
                    <span class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </span>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartSummary();
}

function increaseCartItemQuantity(index) {
    cart[index].quantity++;
    saveCart();
    updateCart();
}

function decreaseCartItemQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
        return;
    }
    saveCart();
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
    updateCartCount();
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function getProductEmoji(productId) {
    return '🛏️';
}

// ==================== CHECKOUT FUNCTIONS ====================
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Hide products and cart
    document.querySelector('.products').style.display = 'none';
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('checkout').classList.remove('hidden');

    // Display checkout items
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'checkout-item';
        itemEl.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemEl);
    });

    updateCheckoutSummary();
    window.scrollTo(0, 0);
}

function backToShop() {
    document.querySelector('.products').style.display = 'block';
    document.getElementById('checkout').classList.add('hidden');
    window.scrollTo(0, 0);
}

function updateCheckoutSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = document.querySelector('input[name="shipping"]:checked').value === 'standard' ? 9.99 :
                     document.querySelector('input[name="shipping"]:checked').value === 'express' ? 24.99 : 49.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

function placeOrder() {
    const shippingForm = document.getElementById('shippingForm');
    const inputs = shippingForm.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = '#DC3545';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }

    // Generate order number
    const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000);

    // Show success modal
    document.getElementById('orderNumber').textContent = `Order #${orderNumber}`;
    document.getElementById('successModal').classList.add('active');

    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();

    // Reset forms
    shippingForm.reset();
    document.getElementById('checkout').classList.add('hidden');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.querySelector('.products').style.display = 'block';
    window.scrollTo(0, 0);
}

// ==================== WISHLIST FUNCTIONS ====================
function addToWishlist(productId = null) {
    const id = productId || (currentProduct ? currentProduct.id : null);
    if (!id) return;

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(id);
        showNotification('Added to wishlist');
    }

    saveWishlist();
}

// ==================== LOCAL STORAGE ====================
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
        updateCart();
    }
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadWishlist() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
        wishlist = JSON.parse(saved);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #28A745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 5000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function submitContact(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    
    // Simulate form submission
    console.log('Contact form submitted:', Object.fromEntries(data));
    showNotification('Thank you! We will get back to you soon.');
    form.reset();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Update checkout summary when shipping method changes
    document.querySelectorAll('input[name="shipping"]').forEach(input => {
        input.addEventListener('change', updateCheckoutSummary);
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close cart when clicking outside
    window.addEventListener('click', function(event) {
        const cart = document.getElementById('cartSidebar');
        if (!cart.contains(event.target) && !event.target.closest('.cart-icon')) {
            cart.classList.remove('active');
        }
    });
}

// ==================== DEMO DATA INITIALIZATION ====================
// Load demo cart on first visit
window.addEventListener('load', function() {
    updateCart();
});
