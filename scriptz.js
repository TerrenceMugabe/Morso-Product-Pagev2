function toggleMenu() {
    const nav = document.getElementById('navMobile');
    if (nav) nav.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // Debug: Check if DOM elements exist
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

    if (!qtyDisplay || !decrementBtn || !incrementBtn || !addToCartBtn || !cartPopup || !closeBtn) {
        console.error('Missing DOM elements:', {
            qtyDisplay, decrementBtn, incrementBtn, addToCartBtn, cartPopup, closeBtn
        });
        return;
    }

    // Gallery thumbnails
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

    // Quantity selector
    let quantity = 0; // Initialize to 0 (cart empty)
    const maxQty = Infinity;
    const basePrice = 3290.00;

    // Format price for South African Rand
    const formatPrice = (price) => {
        return `R${price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Update quantity and prices
    function updateQuantity(change) {
        console.log('updateQuantity called with change:', change, 'Current quantity:', quantity);
        quantity = Math.max(0, Math.min(maxQty, quantity + change)); // Allow 0
        qtyDisplay.textContent = quantity === 0 ? 1 : quantity; // Display 1 if quantity is 0
        decrementBtn.disabled = quantity === 0;
        incrementBtn.disabled = quantity === maxQty;
        const priceDisplay = document.querySelector('.qty-selector span:last-child');
        if (priceDisplay) {
            priceDisplay.textContent = `× ${formatPrice(basePrice * (quantity === 0 ? 1 : quantity))}`; // Show R3,290.00 when quantity is 0
        }
        qtyDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => qtyDisplay.style.transform = 'scale(1)', 150);
        console.log('Updated: Quantity=', quantity, 'Display=', qtyDisplay.textContent, 'Price=', priceDisplay.textContent);
    }

    // Initialize price display
    updateQuantity(0); // Set initial price to R3,290.00, qtyDisplay to 1

    // Cart handler
    function addToCartHandler() {
        console.log('Add to Cart clicked, Quantity before:', quantity);
        addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        addToCartBtn.disabled = true;
        updateQuantity(1); // Increment quantity
        const productName = document.querySelector('.product-page-title')?.textContent || 'Product';
        const productPrice = document.querySelector('.product-page-price')
            ? parseFloat(document.querySelector('.product-page-price').textContent.replace('R', '').replace(',', ''))
            : 3290.00; // Fallback price
        const total = productPrice * quantity;

        setTimeout(() => {
            addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Added to Cart!';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                addToCartBtn.disabled = false;
            }, 2000);

            // Update popup content
            cartItemName.textContent = productName;
            cartItemVariant.textContent = 'With Installation';
            cartItemPrice.textContent = quantity > 0 
                ? `${quantity} x ${formatPrice(productPrice)}` 
                : 'Cart is empty';
            cartSubtotal.textContent = quantity > 0 
                ? formatPrice(total) 
                : formatPrice(0);

            cartPopup.classList.add('active');
            backdrop.classList.add('active'); // Show grey backdrop
            cartPopup.focus(); // Accessibility
            console.log('Popup updated: Quantity=', quantity, 'CartItemPrice=', cartItemPrice.textContent);
        }, 1000);
    }

    // Prevent duplicate listeners
    addToCartBtn.removeEventListener('click', addToCartHandler);
    addToCartBtn.addEventListener('click', addToCartHandler);

    decrementBtn.addEventListener('click', () => {
        console.log('Decrement clicked, Quantity before:', quantity);
        updateQuantity(-1);
    });
    incrementBtn.addEventListener('click', () => {
        console.log('Increment clicked, Quantity before:', quantity);
        updateQuantity(1);
    });

    function clearCart() {
        console.log('Clearing cart, Quantity before:', quantity);
        quantity = 0; // Clear cart
        updateQuantity(0); // Reset displays
        cartItemName.textContent = '';
        cartItemVariant.textContent = '';
        cartItemPrice.textContent = 'Cart is empty';
        cartSubtotal.textContent = formatPrice(0);
        cartPopup.classList.remove('active');
        backdrop.classList.remove('active'); // Hide backdrop
        console.log('Cart cleared: Quantity=', quantity, 'CartItemPrice=', cartItemPrice.textContent);
    }

    closeBtn.addEventListener('click', clearCart);
    backdrop.addEventListener('click', clearCart);

    // Image modal
    mainImage.addEventListener('click', function() {
        if (window.innerWidth < 768) return;
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:1000;cursor:zoom-out;opacity:0;transition:opacity 0.3s;';
        modal.innerHTML = `<img src="${this.src}" style="max-width:90%;max-height:90%;box-shadow:0 0 40px rgba(0,0,0,0.5);" alt="${this.alt}"><button style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:white;font-size:2rem;cursor:pointer;" onclick="this.parentElement.style.opacity='0';setTimeout(()=>document.body.removeChild(this.parentElement),300);">&times;</button>`;
        modal.onclick = e => e.target === modal && (modal.style.opacity = '0', setTimeout(() => document.body.removeChild(modal), 300));
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.style.opacity = '1');
    });

    // Reviews link scroll
    const reviewsLink = document.querySelector('.reviews-link');
    if (reviewsLink) {
        reviewsLink.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector('.reviews-section');
            const offset = 80;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    }

    // Tab functionality
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
