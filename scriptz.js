// Toggles mobile navigation menu.
function toggleMenu() {
    const nav = document.getElementById('navMobile');
    if (nav) nav.classList.toggle('active');
}

// Runs on page load to set up event listeners and initial states.
document.addEventListener('DOMContentLoaded', function() {
    // Check for required DOM elements.
    const qtyDisplay = document.getElementById('qty');
    const decrementBtn = document.querySelector('.js-qty-decrement');
    const incrementBtn = document.querySelector('.js-qty-increment');
    const cartItemPrice = document.getElementById('cart-item-price');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartItemName = document.getElementById('cart-item-name');
    const cartItemVariant = document.getElementById('cart-item-variant');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartPopup = document.querySelector('.cart-popup');
    const backdrop = document.querySelector('.backdrop');
    const closeBtn = document.querySelector('.close-btn');
    const removeBtn = document.querySelector('.remove-btn');

    // Log missing elements for debugging.
    if (!qtyDisplay || !decrementBtn || !incrementBtn || !addToCartBtn || !cartPopup || !closeBtn || !removeBtn) {
        console.error('Missing DOM elements:', {
            qtyDisplay, decrementBtn, incrementBtn, addToCartBtn, cartPopup, closeBtn, removeBtn
        });
        return;
    }

    // Gallery thumbnails: Update main image on click.
    const thumbnails = document.querySelectorAll('.gallerythumb');
    const mainImage = document.querySelector('.mainpic');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            thumbnails.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            const newSrc = this.getAttribute('href');
            const newAlt = this.querySelector('img').alt;
            mainImage.src = newSrc;
            mainImage.alt = newAlt;
            mainImage.style.opacity = '0.8';
            setTimeout(() => mainImage.style.opacity = '1', 150);
        });
    });

    // Quantity and cart setup.
    let quantity = 1; // Current quantity in #qty input.
    let cart = { items: [], totalQuantity: 0, totalPrice: 0 }; // Persistent cart state.
    const maxQty = Infinity;
    const basePrice = 3290.00; // Price per item in ZAR.

    // Format price in South African Rand (e.g., R3,290.00).
    const formatPrice = (price) => {
        return `R${price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Update quantity and price display.
    function updateQuantity(change) {
        console.log('updateQuantity:', change, 'Quantity:', quantity);
        quantity = Math.max(1, Math.min(maxQty, quantity + change)); // Keep between 1 and maxQty.
        qtyDisplay.textContent = quantity;
        decrementBtn.disabled = quantity === 1;
        incrementBtn.disabled = quantity === maxQty;
        const priceDisplay = document.querySelector('.qty-selector span:last-child');
        if (priceDisplay) {
            priceDisplay.textContent = `× ${formatPrice(basePrice * quantity)}`;
        }
        qtyDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => qtyDisplay.style.transform = 'scale(1)', 150);
        console.log('Updated: Quantity=', quantity, 'Price=', priceDisplay.textContent);
    }

    // Initialize quantity and price.
    updateQuantity(0); // Set #qty to 1, price to R3,290.00.

    // Handle Add to Cart.
    function addToCartHandler() {
        console.log('Add to Cart, Quantity:', quantity);
        addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        addToCartBtn.disabled = true;

        // Get product details.
        const productName = document.querySelector('.product-page-title')?.textContent || 'Product';
        const productPriceText = document.querySelector('.product-page-price')?.textContent || 'R3,290';
        const productPrice = parseFloat(productPriceText.replace('R', '').replace(',', '')) || 3290.00;

        // Add selected quantity to cart.
        const existingItem = cart.items.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.quantity * productPrice;
        } else {
            cart.items.push({
                name: productName,
                price: productPrice,
                quantity: quantity,
                totalPrice: quantity * productPrice
            });
        }

        // Update cart totals.
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Update popup after delay.
        setTimeout(() => {
            addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Added to Cart!';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                addToCartBtn.disabled = false;
            }, 2000);

            // Update popup content.
            cartItemName.textContent = productName;
            cartItemVariant.textContent = 'With Installation';
            cartItemPrice.textContent = cart.totalQuantity > 0 
                ? `${cart.totalQuantity} x ${formatPrice(productPrice)}` 
                : 'Your cart is empty';
            cartSubtotal.textContent = cart.totalQuantity > 0 
                ? formatPrice(cart.totalPrice) 
                : formatPrice(0);

            cartPopup.classList.add('active');
            backdrop.classList.add('active');
            cartPopup.focus();
            console.log('Popup: Total Quantity=', cart.totalQuantity, 'Price=', cartItemPrice.textContent);
        }, 1000);
    }

    // Prevent duplicate listeners.
    addToCartBtn.removeEventListener('click', addToCartHandler);
    addToCartBtn.addEventListener('click', addToCartHandler);

    // Quantity button listeners.
    decrementBtn.addEventListener('click', () => {
        console.log('Decrement, Quantity:', quantity);
        updateQuantity(-1);
    });
    incrementBtn.addEventListener('click', () => {
        console.log('Increment, Quantity:', quantity);
        updateQuantity(1);
    });

    // Clear cart and reset.
    function clearCart() {
        console.log('Clearing cart, Total Quantity:', cart.totalQuantity);
        cart = { items: [], totalQuantity: 0, totalPrice: 0 };
        quantity = 1;
        updateQuantity(0);
        cartItemName.textContent = '';
        cartItemVariant.textContent = '';
        cartItemPrice.textContent = 'Your cart is empty';
        cartSubtotal.textContent = formatPrice(0);
        cartPopup.classList.remove('active');
        backdrop.classList.remove('active');
        console.log('Cart cleared: Total Quantity=', cart.totalQuantity);
    }

    // Attach clearCart to buttons.
    closeBtn.addEventListener('click', clearCart);
    backdrop.addEventListener('click', clearCart);
    removeBtn.addEventListener('click', clearCart);

    // Image modal: Show enlarged image on click (desktop only).
    mainImage.addEventListener('click', function() {
        if (window.innerWidth < 768) return;
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:1000;cursor:zoom-out;opacity:0;transition:opacity 0.3s;';
        modal.innerHTML = `<img src="${this.src}" style="max-width:90%;max-height:90%;box-shadow:0 0 40px rgba(0,0,0,0.5);" alt="${this.alt}"><button style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:white;font-size:2rem;cursor:pointer;" onclick="this.parentElement.style.opacity='0';setTimeout(()=>document.body.removeChild(this.parentElement),300);">&times;</button>`;
        modal.onclick = e => e.target === modal && (modal.style.opacity = '0', setTimeout(() => document.body.removeChild(modal), 300));
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.style.opacity = '1');
    });

    // Reviews link: Smooth scroll to reviews.
    const reviewsLink = document.querySelector('.reviews-link');
    if (reviewsLink) {
        reviewsLink.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector('.reviews-section');
            const offset = 80;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    }

    // Tabs: Switch between tab panels.
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
});
