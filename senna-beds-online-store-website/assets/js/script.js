/* ============================================================
   SENNA BEDS — script.js
   Runs after components.js has injected header/footer/cart.
============================================================ */

const CART_KEY = 'senna_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlider();
  initTestimonialSlider();
  initFAQ();
  initGalleryPopup();
  initCartSystem();
  initScrollReveal();
  initScrollHeader();
  initAddToCartButtons();
  initShopPage();
  initCheckoutPage();
  updateCartUI();

  // Contact form
  document.querySelector('.contact-form form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.");
    e.target.reset();
  });

  // Blog comment form
  document.querySelector('.reply-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Comment posted! Thank you.');
    e.target.reset();
  });
});

/* ----------------------------------------------------------
   NAVIGATION & SIDEBAR
---------------------------------------------------------- */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar-menu');
  const overlay   = document.querySelector('.sidebar-overlay');
  const closeBtn  = document.querySelector('.close-sidebar');

  const openSidebar = () => {
    sidebar?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSidebar(); closeCartDrawer(); closeImagePopup(); }
  });
}

function initScrollHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ----------------------------------------------------------
   SLIDERS
---------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  let idx = 0;
  const showSlide = () => {
    slides.forEach(s => s.classList.remove('active'));
    slides[idx].classList.add('active');
    idx = (idx + 1) % slides.length;
  };
  showSlide();
  setInterval(showSlide, 3500);
}

function initTestimonialSlider() {
  const cards   = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  if (!cards.length) return;
  let current = 0;
  const showCard = i => {
    cards.forEach(c => c.classList.remove('active'));
    cards[i].classList.add('active');
  };
  nextBtn?.addEventListener('click', () => { current = (current + 1) % cards.length; showCard(current); });
  prevBtn?.addEventListener('click', () => { current = (current - 1 + cards.length) % cards.length; showCard(current); });
  setInterval(() => { current = (current + 1) % cards.length; showCard(current); }, 5000);
}

/* ----------------------------------------------------------
   FAQ
---------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(el => el.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ----------------------------------------------------------
   IMAGE POPUP
---------------------------------------------------------- */
function initGalleryPopup() {
  document.querySelectorAll('.sidebar-gallery img, .hero-right .img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openImagePopup(img.src));
  });
  document.getElementById('closePopup')?.addEventListener('click', closeImagePopup);
  document.getElementById('imagePopup')?.addEventListener('click', e => {
    if (e.target !== document.getElementById('popupImg')) closeImagePopup();
  });
}

function openImagePopup(src) {
  const popup    = document.getElementById('imagePopup');
  const popupImg = document.getElementById('popupImg');
  if (!popup || !popupImg) return;
  popupImg.src = src;
  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImagePopup() {
  document.getElementById('imagePopup')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* ----------------------------------------------------------
   SCROLL REVEAL
---------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.product-card, .blog-card, .why-card, .sale-box, .banner, .shop-card, .stat-card, .info-box'
  );
  targets.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   ADD TO CART — event delegation
---------------------------------------------------------- */
function initAddToCartButtons() {
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.add-cart-btn');
    if (!btn) return;
    const product = {
      id   : btn.dataset.id,
      name : btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      image: btn.dataset.image
    };
    if (!product.id || !product.name || isNaN(product.price)) return;
    addToCart(product);
    btn.classList.add('added');
    const original = btn.textContent;
    btn.textContent = '✓ Added';
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = original; }, 1600);
  });
}

/* ----------------------------------------------------------
   SHOP PAGE — wire up shop card buttons automatically
---------------------------------------------------------- */
function initShopPage() {
  document.querySelectorAll('.shop-card').forEach((card, i) => {
    const btn   = card.querySelector('button');
    const name  = card.querySelector('h3')?.textContent?.trim() || 'Product';
    const price = card.querySelector('p')?.textContent?.replace('$','').trim() || '0';
    const image = card.querySelector('img')?.src || '';
    if (btn) {
      btn.classList.add('add-cart-btn');
      btn.dataset.id    = `shop-${i + 1}`;
      btn.dataset.name  = name;
      btn.dataset.price = price;
      btn.dataset.image = image;
    }
  });
}

/* ----------------------------------------------------------
   CART SYSTEM
---------------------------------------------------------- */
function initCartSystem() {
  document.body.addEventListener('click', e => {
    if (e.target.closest('#cartIconBtn')) { e.preventDefault(); openCartDrawer(); }
    if (e.target.closest('#closeCart')) closeCartDrawer();
    if (e.target.id === 'cartOverlay') closeCartDrawer();
  });
}

function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) { existing.quantity += 1; }
  else { cart.push({ ...product, quantity: 1 }); }
  saveCart(); updateCartUI(); openCartDrawer();
  showToast(`${product.name} added to cart`);
  bumpCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart(); updateCartUI();
}

function changeQuantity(id, action) {
  cart = cart.map(item => {
    if (item.id === id) item.quantity += action === 'increase' ? 1 : -1;
    return item;
  }).filter(item => item.quantity > 0);
  saveCart(); updateCartUI();
}

/* ----------------------------------------------------------
   UPDATE CART UI
---------------------------------------------------------- */
function updateCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const countEl   = document.querySelector('.cart-count');
  const totalEl   = document.getElementById('cartTotal');

  let total = 0, totalItems = 0, drawerHTML = '';

  if (!cart.length) {
    if (container) container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <h3>Your cart is empty</h3>
        <p>Add luxury furniture to start shopping</p>
        <a href="shop.html" class="view-collection-btn">View Collection</a>
      </div>`;
    if (countEl) countEl.textContent = '0';
    if (totalEl) totalEl.textContent = '$0.00';
    renderCartPage(); return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal; totalItems += item.quantity;
    drawerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/72x72?text=Bed'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="cart-quantity">
            <button onclick="changeQuantity('${item.id}','decrease')">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity('${item.id}','increase')">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>`;
  });

  if (container) container.innerHTML = drawerHTML;
  if (countEl) countEl.textContent = totalItems;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  renderCartPage();
}

/* ----------------------------------------------------------
   CART PAGE
---------------------------------------------------------- */
function renderCartPage() {
  const pageItems    = document.querySelector('.cart-page-items');
  const pageSubtotal = document.querySelector('.cart-subtotal-val');
  const pageTotal    = document.querySelector('.cart-total-val');
  if (!pageItems) return;

  if (!cart.length) {
    pageItems.innerHTML = `
      <div class="cart-page-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <h2>Your cart is empty</h2>
        <a href="shop.html" class="hero-btn" style="display:inline-block;margin-top:20px;text-decoration:none">Browse Shop</a>
      </div>`;
    if (pageSubtotal) pageSubtotal.textContent = '$0.00';
    if (pageTotal)    pageTotal.textContent    = '$0.00';
    return;
  }

  let html = '', total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-product">
        <div class="cart-product-info">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/140x140?text=Bed'">
          <div class="cart-details">
            <h3>${item.name}</h3>
            <p class="product-price">$${item.price.toFixed(2)}</p>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">× Remove</button>
          </div>
        </div>
        <div class="cart-quantity">
          <button onclick="changeQuantity('${item.id}','decrease')">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}','increase')">+</button>
        </div>
        <div class="cart-subtotal">$${itemTotal.toFixed(2)}</div>
      </div>`;
  });

  pageItems.innerHTML = html;
  if (pageSubtotal) pageSubtotal.textContent = `$${total.toFixed(2)}`;
  if (pageTotal)    pageTotal.textContent    = `$${total.toFixed(2)}`;
}

/* ----------------------------------------------------------
   CHECKOUT PAGE
---------------------------------------------------------- */
function initCheckoutPage() {
  const summaryContainer = document.querySelector('.senna-checkout-items');
  const checkoutSubtotal = document.querySelector('.checkout-subtotal');
  const checkoutTotal    = document.querySelector('.checkout-total');
  const placeOrderBtn    = document.querySelector('.senna-place-order');
  if (!summaryContainer) return;

  const cartData = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  if (!cartData.length) {
    summaryContainer.innerHTML = '<p style="color:rgba(255,255,255,0.6);font-size:14px">No items in cart.</p>';
    return;
  }

  let html = '', total = 0;
  cartData.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="senna-product">
        <div class="senna-product-info">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/70x70?text=Bed'">
          <div><h4>${item.name}</h4><span>Qty: ${item.quantity}</span></div>
        </div>
        <h5>$${itemTotal.toFixed(2)}</h5>
      </div>`;
  });

  summaryContainer.innerHTML = html;
  const shipping = total > 0 ? 0 : 0;
  if (checkoutSubtotal) checkoutSubtotal.textContent = `$${total.toFixed(2)}`;
  if (checkoutTotal)    checkoutTotal.textContent    = `$${total.toFixed(2)}`;

  placeOrderBtn?.addEventListener('click', () => {
    showToast('Order placed! Thank you for shopping with Senna Beds.');
    localStorage.removeItem(CART_KEY);
    cart = [];
    setTimeout(() => window.location.href = 'index.html', 2500);
  });
}

/* ----------------------------------------------------------
   TOAST & ANIMATIONS
---------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function bumpCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (!countEl) return;
  countEl.classList.add('bump');
  setTimeout(() => countEl.classList.remove('bump'), 300);
}

/* ----------------------------------------------------------
   GLOBAL EXPORTS
---------------------------------------------------------- */
window.addToCart       = addToCart;
window.removeFromCart  = removeFromCart;
window.changeQuantity  = changeQuantity;
window.updateCartUI    = updateCartUI;
window.openCartDrawer  = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.showToast       = showToast;