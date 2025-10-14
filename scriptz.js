function toggleMenu() {
    const nav = document.getElementById('navMobile');
    nav.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
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

    const qtyDisplay = document.getElementById('qty');
    const decrementBtn = document.querySelector('.js-qty-decrement');
    const incrementBtn = document.querySelector('.js-qty-increment');
    let quantity = 1;
    const maxQty = Infinity;
    const basePrice = 3290;

    function updateQuantity(change) {
        quantity = Math.max(1, Math.min(maxQty, quantity + change));
        qtyDisplay.textContent = quantity;
        decrementBtn.disabled = quantity === 1;
        incrementBtn.disabled = quantity === maxQty;
        document.querySelector('.qty-selector span:last-child').textContent = `× R${(basePrice * quantity).toLocaleString()}.00`;
        qtyDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => qtyDisplay.style.transform = 'scale(1)', 150);
    }

    decrementBtn.addEventListener('click', () => updateQuantity(-1));
    incrementBtn.addEventListener('click', () => updateQuantity(1));

    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartPopup = document.querySelector('.cart-popup');
    const closeBtn = document.querySelector('.close-btn');
    const cartItemName = document.getElementById('cart-item-name');
    const cartItemVariant = document.getElementById('cart-item-variant');
    const cartItemPrice = document.getElementById('cart-item-price');
    const cartSubtotal = document.getElementById('cart-subtotal');

    addToCartBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        this.disabled = true;
        const productName = document.querySelector('.product-page-title').textContent;
        const productPrice = document.querySelector('.product-page-price').textContent.replace('R', '').trim();
        const totalPrice = `R${(parseFloat(productPrice) * quantity).toLocaleString()}.`;

        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-shopping-cart"></i> Added to Cart!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.disabled = false;
            }, 2000);

            // Update popup content
            cartItemName.textContent = productName;
            cartItemVariant.textContent = 'With Installation';
            cartItemPrice.textContent = `${quantity} x ${totalPrice}`;
            cartSubtotal.textContent = totalPrice;

            cartPopup.classList.add('active'); // Show the popup
        }, 1000);
    });

    closeBtn.addEventListener('click', function() {
        cartPopup.classList.remove('active'); // Hide the popup
    });

    mainImage.addEventListener('click', function() {
        if (window.innerWidth < 768) return;
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:1000;cursor:zoom-out;opacity:0;transition:opacity 0.3s;';
        modal.innerHTML = `<img src="${this.src}" style="max-width:90%;max-height:90%;box-shadow:0 0 40px rgba(0,0,0,0.5);" alt="${this.alt}"><button style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:white;font-size:2rem;cursor:pointer;" onclick="this.parentElement.style.opacity=\'0\';setTimeout(()=>document.body.removeChild(this.parentElement),300);">&times;</button>`;
        modal.onclick = e => e.target === modal && (modal.style.opacity = '0', setTimeout(() => document.body.removeChild(modal), 300));
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.style.opacity = '1');
    });

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

