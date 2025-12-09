/* ==============================================
   DATA: Menu Items (Rupees ₹)
   ============================================== */
const menuData = [
    // 1. Big Pizza
    { id: 101, category: "bigpizza", name: "Big Big 6in1 Pizza – Non Veg Meatzilla", price: 499, desc: "A large, square pizza offering six different non-vegetarian flavors in one.", img: "images/the_big_bbq.jpg" },
    { id: 102, category: "bigpizza", name: "Big Big 6in1 Pizza – Veg Cheezilla", price: 549, desc: "Loaded with sausages, pepperoni and chicken.", img: "images/big_big_veg.jpg" },
    
    // 2. Crazy Deals
    { id: 201, category: "deals", name: "Meal for 2", price: 399, desc: "2 Medium Pizzas + Garlic Bread.", img: "images/meal_for_2.jpg" },
    { id: 202, category: "deals", name: "Family Party", price: 799, desc: "3 Large Pizzas + Coke.", img: "images/family_combo.jpg" },

    // 3. Veg Pizza
    { id: 301, category: "veg", name: "Farmhouse", price: 229, desc: "Onion, Capsicum, Tomato & Grilled Mushroom.", img: "images/farmhouse.jpg" },
    { id: 302, category: "veg", name: "Veg Extravaganza", price: 279, desc: "Black olives, capsicum, onion, corn, jalapeno.", img: "images/veg_extravaganza.jpg" },
    { id: 303, category: "veg", name: "Margherita", price: 109, desc: "Classic cheese pizza.", img: "images/Margherita.jpg" },

    // 4. Pizza Mania
    { id: 401, category: "mania", name: "Golden Corn", price: 89, desc: "Sweet Corn and Cheese.", img: "images/golden_corn.jpg" },
    { id: 402, category: "mania", name: "Onion", price: 79, desc: "Crunchy Onion and Cheese.", img: "images/Onion.jpg" },

    // 5. Garlic Bread
    { id: 501, category: "bread", name: "Stuffed Garlic Bread", price: 149, desc: "Freshly baked with cheese stuffing.", img: "images/Stuffed_Garlic_Bread.jpg" },
    { id: 502, category: "bread", name: "Paneer Tikka Bread", price: 159, desc: "Spiced paneer stuffing.", img: "images/Stuffed_Garlic_Bread_Panner.jpg" },

    // 6. Cheese Volcano
    { id: 601, category: "volcano", name: "Volcano Peppy", price: 329, desc: "Center filled with liquid cheese lava.", img: "images/volcano_peppy.jpg" },

    // 7. Cheese Burst
    { id: 701, category: "burst", name: "Cheese Burst", price: 1, desc: "Crust filled with creamy cheese.", img: "images/cheese_burst.jpg" },

    // 8. Desserts
    { id: 801, category: "dessert", name: "Choco Lava Cake", price: 109, desc: "Molten chocolate filling.", img: "images/Choco_Lava_Cake.jpg" },
    { id: 802, category: "dessert", name: "Butterscotch Mousse", price: 99, desc: "Sweet creamy delight.", img: "images/Butterscotch_Mousse.jpg" }
];

/* ==============================================
   STATE MANAGEMENT
   ============================================== */
let cart = JSON.parse(localStorage.getItem('dominosCart')) || [];
let currentDiscount = 0; // 0 = none, 50 = 50%, 1 = Free Gift

/* ==============================================
   INIT
   ============================================== */
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // If we are on the menu page, render items
    if (document.getElementById('menu-container')) {
        renderMenu();
        // Check hash to scroll to section
        if(window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if(el) setTimeout(() => el.scrollIntoView({behavior: "smooth"}), 100);
        }
    }

    // Cart Sidebar Toggle Logic
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const sidebar = document.getElementById('cart-sidebar');

    if(cartBtn) {
        cartBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }
    
    if(closeCart) {
        closeCart.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }
});

/* ==============================================
   MENU RENDERING
   ============================================== */
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    const categories = [
        {key: 'bigpizza', title: 'Big Big Pizza'},
        {key: 'deals', title: 'Crazy Deals'},
        {key: 'veg', title: 'Veg Pizza'},
        {key: 'mania', title: 'Pizza Mania'},
        {key: 'bread', title: 'Breads & Sides'},
        {key: 'volcano', title: 'Cheese Volcano'},
        {key: 'burst', title: 'Cheese Burst'},
        {key: 'dessert', title: 'Desserts'}
    ];

    categories.forEach(cat => {
        // Create Section
        const section = document.createElement('div');
        section.id = cat.key;
        section.innerHTML = `<h2 class="menu-section-title">${cat.title}</h2>`;
        
        const grid = document.createElement('div');
        grid.className = 'menu-grid';

        // Filter items for this category
        const items = menuData.filter(i => i.category === cat.key);
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'pizza-card';
            
            // Check if in cart
            const inCart = cart.find(c => c.id === item.id);
            
            let btnHtml = '';
            if (inCart) {
                btnHtml = `
                    <div class="qty-controls-card">
                        <button onclick="updateQty(${item.id}, -1)">-</button>
                        <span>${inCart.qty}</span>
                        <button onclick="updateQty(${item.id}, 1)">+</button>
                    </div>`;
            } else {
                btnHtml = `<button class="btn-add" onclick="addToCart(${item.id})">ADD TO CART</button>`;
            }

            card.innerHTML = `
                <img src="${item.img}" class="pizza-img" alt="${item.name}">
                <div class="pizza-info">
                    <h3 class="pizza-name">${item.name}</h3>
                    <p class="pizza-desc">${item.desc}</p>
                    <div class="pizza-price">₹${item.price}</div>
                </div>
                <div id="btn-container-${item.id}">
                    ${btnHtml}
                </div>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
}

/* ==============================================
   CART LOGIC
   ============================================== */
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    // Open cart sidebar on first add
    const sidebar = document.getElementById('cart-sidebar');
    if(sidebar) sidebar.classList.add('open');

    saveCart();
}

function updateQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== id);
        }
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem('dominosCart', JSON.stringify(cart));
    updateCartUI();
    if(document.getElementById('menu-container')) renderMenu(); // Re-render menu to update card buttons
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');
    const finalTotalEl = document.getElementById('final-total');
    
    // Update Badge
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if(cartCount) cartCount.innerText = totalQty;

    // Render Sidebar Items
    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = '';
        
        if(cart.length === 0) {
            cartItemsDiv.innerHTML = '<p style="text-align:center; margin-top:20px; color:#666;">Your cart is empty!</p>';
        }

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.qty}</p>
                    </div>
                    <div class="cart-controls">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <span style="font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
        });

        // Apply Discount Logic
        let finalAmt = total;
        
        if (currentDiscount === 50) {
            let discAmt = total * 0.5;
            if(discAmt > 100) discAmt = 100; // Cap at 100
            finalAmt = total - discAmt;
            cartItemsDiv.innerHTML += `<div style="color:green; text-align:right; font-weight:bold; margin-top:10px;">Coupon (DOM50): -₹${discAmt}</div>`;
        } 
        else if (currentDiscount === 1) {
             cartItemsDiv.innerHTML += `<div style="color:green; text-align:right; font-weight:bold; margin-top:10px;">Coupon (PARTY3): Free Garlic Bread Added!</div>`;
        }

        if(finalTotalEl) finalTotalEl.innerText = '₹' + Math.floor(finalAmt);
    }
}

/* ==============================================
   COUPON LOGIC
   ============================================== */
function applyCoupon() {
    const code = document.getElementById('coupon-input').value.toUpperCase();
    
    if (code === 'DOM50') {
        currentDiscount = 50; 
        alert('YAY! Coupon Applied: 50% Off (Max ₹100)');
    } else if (code === 'PARTY3') {
        // Logic: Check if at least 3 pizzas are in cart
        const pizzas = cart.filter(c => c.category === 'veg' || c.category === 'bigpizza' || c.category === 'mania').reduce((sum, i)=> sum+i.qty,0);
        if(pizzas >= 3) {
            currentDiscount = 1;
            alert('YAY! Coupon Applied: Free Garlic Bread included with your meal!');
        } else {
            alert('Please add at least 3 Pizzas to the cart to use this code.');
            currentDiscount = 0;
        }
    } else {
        alert('Invalid Coupon Code');
        currentDiscount = 0;
    }
    updateCartUI();
}

/* ==============================================
   LOCATION LOGIC
   ============================================== */
function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Redirect to Google Maps searching for Domino's near user's lat/long
                window.open(`https://www.google.com/maps/search/domino's+pizza+near+me/@${lat},${lng},14z`, '_blank');
            },
            () => {
                alert("Location access denied. Searching generally.");
                window.open(`https://www.google.com/maps/search/domino's+pizza+near+me`, '_blank');
            }
        );
    } else {
        window.open(`https://www.google.com/maps/search/domino's+pizza+near+me`, '_blank');
    }
}