
// Get all filter checkboxes
const filters = document.querySelectorAll('#filterDropdown input[type="checkbox"]');
const noMatch = document.getElementById('no-match');
if (noMatch) {
    noMatch.style.display = "none";
}
// Get all products and count
const products = document.querySelectorAll('.product-card');
const productCount = document.getElementById('product-count');

// Add change listener to every checkbox
filters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
});

function applyFilters() {

    // Collect selected filters
    let selected = {
        category: [],
        type: [],
        flavour: []
    };

    let matchCount = 0; // count visible products

    filters.forEach(f => {
        if (f.checked) {
            let type = f.dataset.filterType;   // category / type / flavour
            selected[type].push(f.value.trim());
        }
    });

    // Loop through each product and check match
    products.forEach(product => {
        let productCategory = product.dataset.category;
        let productType = product.dataset.type;
        let productFlavour = product.dataset.flavour;
        let match = true;

        // Category filter
        if (selected.category.length > 0 &&
            !selected.category.includes(productCategory)) {
            match = false;
        }

        // Type filter
        if (selected.type.length > 0 &&
            !selected.type.includes(productType)) {
            match = false;
        }

        // Flavour filter 
        if (selected.flavour.length > 0 &&
            !selected.flavour.includes(productFlavour)) {
            match = false;
        }


        // Show / Hide product
        if (match) {
            product.style.display = "block";
            matchCount++;      // count visible items
        } else {
            product.style.display = "none";
        }

        productCount.innerText = matchCount;

        if (matchCount === 0) {
            noMatch.style.display = "block";
        } else {
            noMatch.style.display = "none";
        }

    });
}

function goToHome() {
    window.location.href = "index.html"; //navigate to home page
}

function goToProductListing() {
    window.location.href = "products.html"; //navigate to product listing page
}

function goToCart() {
    window.location.href = "cart.html"; //navigate to product listing page
}

function toggleFilter() {
    document.querySelector(".filter-dropdown").classList.toggle("open");
}

function toggleSort() {
    document.querySelector("#sort-dropdown").classList.toggle("open");
}

let currentSort = document.getElementById('current-sort');

function sortZA() {
    const grid = document.querySelector('.product-grid');
    const cards = Array.from(document.querySelectorAll('.product-card'));
    currentSort.innerText = "Alphabetically. Z-A";

    cards.sort((a, b) => {
        const titleA = a.querySelector('.product-title').innerText.toLowerCase();
        const titleB = b.querySelector('.product-title').innerText.toLowerCase();
        return titleB.localeCompare(titleA); // reverse order
    });

    cards.forEach(card => grid.appendChild(card));
}

function sortAZ() {
    const grid = document.querySelector('.product-grid');
    const cards = Array.from(document.querySelectorAll('.product-card'));
    currentSort.innerText = "Alphabetically. A-Z";

    cards.sort((a, b) => {
        const titleA = a.querySelector('.product-title').innerText.toLowerCase();
        const titleB = b.querySelector('.product-title').innerText.toLowerCase();
        return titleA.localeCompare(titleB); // straight order
    });

    cards.forEach(card => grid.appendChild(card));
}

let thumbs = document.getElementsByClassName('thumb');

function changeImage(element) {
    document.getElementById("mainImage").src = element.src;

    for (let t of thumbs) {
        t.classList.remove("active");
    }

    element.classList.add("active");
}

function openProduct(card) {
    const product = {
        title: card.dataset.title,
        price: card.dataset.price,
        oldPrice: card.dataset.old,
        image: card.dataset.image
    };

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "checkout.html";
}

const breadcrumbs = document.getElementById('product-breadcrumbs');
const proTitle = document.getElementById('product-title');
const prodDescription = document.getElementById('product-description');
const proReview = document.getElementById('product-reviews');
const proPrice = document.getElementById('product-price');
const proOldPrice = document.getElementById('product-old-price');
const activeImage = document.getElementById('active-img');

let selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

//setting cart count;
let productsInCart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.getElementById("cart-count");
const cartCount1= document.getElementById("cart-count-1");
if (cartCount) {
    cartCount.innerText = productsInCart.length;
}
if (cartCount1) {
    cartCount1.innerText = `${productsInCart.length} ${productsInCart.length === 1 ? "Item" : "Items"}`;
}


if (selectedProduct && breadcrumbs) {
    console.log('selected product==>', selectedProduct);
    breadcrumbs.innerText = selectedProduct.title;
    proTitle.innerText = selectedProduct.title;
    proPrice.innerText = "$" + selectedProduct.price;
    activeImage.src = selectedProduct.image;
    proOldPrice.innerText = "$" + selectedProduct.oldPrice;

    document.getElementById("mainImage").src = selectedProduct.image;
}

//push to cart
function addToCart() {

    // Get cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
     let itemToAdd = {
        ...selectedProduct,
        id: Date.now()
    };
    cart.push(itemToAdd);


    // Save cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count if exists
    if (cartCount) {
        cartCount.innerText = cart.length;
    }

    // Change button text briefly
    const btn = document.getElementById("Add-cart");
    const originalText = btn.innerText;

    btn.innerHTML = `<i class="bi bi-check2-circle"></i> ADDED `;

    setTimeout(() => {
        btn.innerText = originalText;
    }, 1500); // 1.5 seconds
}


//Load items to cart

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsDiv = document.getElementById("cart-items");
    let total = 0;

    if (cart.length === 0 && cartItemsDiv) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }
    if(cartItemsDiv){
        cartItemsDiv.innerHTML = "";
    }

    cart.forEach((item, index) => {
        total += parseFloat(item.price);

        cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-info">
                        <h4>${item.title}</h4>
                        <p class="description">Your new cooking BFF! You can add this to virtually everything.
                    Try it on rice, on meat or tofu, in your burger, ramen and
                    pretty much anything.</p>
                    <div class="stars d-flex" style="padding:0px !important; width:fit-content; border:none">
                        <i class="bi bi-star-fill star-icon"></i>
                        <i class="bi bi-star-fill star-icon"></i>
                        <i class="bi bi-star-fill star-icon"></i>
                        <i class="bi bi-star-fill star-icon"></i>
                        <i class="bi bi-star-fill star-icon"></i>
                     </div>
                        <p class="no-margin price">$${item.price}</p>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>
            `;
    });

    const cartTotal=document.getElementById("cart-total");
    if(cartTotal){
        cartTotal.innerText = "$" + total.toFixed(2);
    }
}

function removeFromCart(id) {

    // get cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // filter out the item
    cart = cart.filter(item => item.id !== id);

    // save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // update cart count
    document.getElementById("cart-count").innerText = cart.length;
    document.getElementById("cart-count-1").innerText =
    `${cart.length} ${cart.length === 1 ? "Item" : "Items"}`;

    // re-render cart list
    loadCart();
}


loadCart();