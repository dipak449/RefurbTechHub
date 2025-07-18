// Enhanced script.js with full cart system, sidebar toggle, toast notifications, dynamic total price, overlay compatibility, localStorage, and improved UX with quantity controls

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function closeProductView() {
  document.getElementById('productOverlay').classList.add('d-none');
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('section, .carousel-wrapper, .buying-section').forEach(el => el.style.display = '');
}


function closeBrandOverlay() {
  document.getElementById('brandOverlay').classList.add('d-none');
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('section, .carousel-wrapper, .buying-section').forEach(el => el.style.display = '');
}

function toggleCartSidebar() {
  const cartSidebar = document.getElementById('cartSidebar');
  cartSidebar.classList.toggle('d-none');
  renderCartItems();
}

function renderCartItems() {
  const cartList = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartList.innerHTML = '';
  let total = 0;

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="text-center">Your cart is empty</p>';
    if (cartTotal) cartTotal.innerText = '₹0';
    return;
  }

  cartItems.forEach((item, index) => {
    const price = parseInt(item.price.replace(/[^\d]/g, '')) * (item.qty || 1);
    total += price;

    const div = document.createElement('div');
    div.className = 'cart-item mb-3';
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img src="${item.img}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 10px;">
          <div>
            <p class="mb-0 fw-bold">${item.title}</p>
            <p class="mb-0 text-muted small">
            ${item.price} (${item.condition}, ${item.ram}, ${item.storage}, ${item.color})
            </p>

            <div class="d-flex align-items-center mt-1">
              <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateQty(${index}, -1)">-</button>
              <span>${item.qty || 1}</span>
              <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateQty(${index}, 1)">+</button>
            </div>
          </div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeCartItem(${index})">×</button>
      </div>
    `;
    cartList.appendChild(div);
    document.getElementById('cartCount').innerText = cartItems.length;

  });

  if (cartTotal) cartTotal.innerText = `₹${total.toLocaleString()}`;
}

function updateQty(index, change) {
  cartItems[index].qty = (cartItems[index].qty || 1) + change;
  if (cartItems[index].qty < 1) cartItems[index].qty = 1;
  saveCart();
  renderCartItems();
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  saveCart();
  renderCartItems();
  showToast('Item removed from cart.', 'danger');
}

function clearCart() {
  cartItems = [];
  saveCart();
  renderCartItems();
  showToast('Cart cleared.', 'warning');
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function attachProductClickEvents() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function () {
      const img = this.querySelector('img')?.src || '';
      const title = this.querySelector('.card-title')?.innerText || 'No Title';
      const priceText = this.querySelector('.current-price')?.innerText || '₹0';
      const basePrice = parseInt(priceText.replace(/[₹,]/g, ''));

      document.getElementById('overlayMainImage').src = img;
      document.getElementById('overlayTitle').innerText = title;
      document.getElementById('overlayPrice').innerText = `Price: ₹${basePrice.toLocaleString()}`;
      document.getElementById('productOverlay').setAttribute('data-baseprice', basePrice);
      document.getElementById('productOverlay').setAttribute('data-title', title);
      document.getElementById('productOverlay').setAttribute('data-img', img);

      const thumbnails = [
        img,
        'https://via.placeholder.com/300x200?text=Side+View',
        'https://via.placeholder.com/300x200?text=Back+View'
      ];
      const thumbContainer = document.getElementById('thumbnailContainer');
      thumbContainer.innerHTML = '';
      thumbnails.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        if (index === 0) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
          document.getElementById('overlayMainImage').src = src;
          thumbContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
          thumb.classList.add('active');
        });
        thumbContainer.appendChild(thumb);
      });

      document.getElementById('brandOverlay')?.classList.add('d-none');
      document.getElementById('productOverlay').classList.remove('d-none');
      document.body.classList.add('no-scroll');
    });
  });
}

function shuffleAndDisplay(templateId, containerId) {
    const template = document.getElementById(templateId);
    const container = document.getElementById(containerId);
    if (!template || !container) return;
  
    const allCards = Array.from(template.content.cloneNode(true).children);
    const shuffled = allCards.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
  
    container.innerHTML = '';
    selected.forEach(card => container.appendChild(card));
  }
  
  function showBrandProducts(brandName, categoryType) {
    document.querySelectorAll('section, .carousel-wrapper, .buying-section').forEach(el => el.style.display = 'none');
    document.getElementById('brandTitle').innerText = `Showing "${capitalize(brandName)}" in ${capitalize(categoryType)}`;
  
    const container = document.getElementById('brandProductsContainer');
    container.innerHTML = '';
  
    const templates = {
      phone: 'phoneProducts',
      laptop: 'laptopProducts',
      tablet: 'tabletProducts',
      watch: 'watchProducts'
    };
  
    const templateId = templates[categoryType];
    const template = document.getElementById(templateId);
  
    if (!template) return;
  
    const allCards = Array.from(template.content.cloneNode(true).children);
    const filteredCards = allCards.filter(card =>
      card.dataset.brand?.toLowerCase() === brandName &&
      card.dataset.category?.toLowerCase() === categoryType
    );
  
    filteredCards.forEach(card => {
        card.classList.add('col-md-4', 'col-6');
        container.appendChild(card);
      });
      
      attachProductClickEvents(); // <-- this ensures new cards are interactive
      
  
    document.getElementById('brandOverlay').classList.remove('d-none');
    document.body.classList.add('no-scroll');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  
function showToast(message, type = 'success') {
  const toastEl = document.getElementById('cartToast');
  if (toastEl) {
    toastEl.querySelector('.toast-body').textContent = message;
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

function addToCart(title, price, img) {
  const overlay = document.getElementById('productOverlay');

  const selectedConditionBtn = overlay.querySelector('.condition-option.active');
  const selectedCondition = selectedConditionBtn ? selectedConditionBtn.dataset.condition : 'like-new';

  const selectedRamBtn = overlay.querySelector('.ram-option.active');
  const selectedRam = selectedRamBtn ? selectedRamBtn.innerText.trim() : 'Default RAM';

  const selectedStorageBtn = overlay.querySelector('.storage-option.active');
  const selectedStorage = selectedStorageBtn ? selectedStorageBtn.innerText.trim() : 'Default Storage';

  const selectedColorSwatch = overlay.querySelector('.color-swatch.selected');
  const selectedColor = selectedColorSwatch ? selectedColorSwatch.title || selectedColorSwatch.className : 'Default Color';

  const uniqueKey = `${title}-${price}-${selectedCondition}-${selectedRam}-${selectedStorage}-${selectedColor}`;

  const existingIndex = cartItems.findIndex(item => item.key === uniqueKey);

  if (existingIndex >= 0) {
    cartItems[existingIndex].qty = (cartItems[existingIndex].qty || 1) + 1;
  } else {
    cartItems.push({
      title,
      price,
      img,
      condition: selectedCondition,
      ram: selectedRam,
      storage: selectedStorage,
      color: selectedColor,
      qty: 1,
      key: uniqueKey
    });
  }

  saveCart();
  renderCartItems();

  const cartSidebar = document.getElementById('cartSidebar');
  if (cartSidebar.classList.contains('d-none')) {
    cartSidebar.classList.remove('d-none');
  }

  showToast('Item added to cart.');
}

document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('productOverlay');

  overlay?.querySelector('.btn-success')?.addEventListener('click', function () {
    const title = overlay.getAttribute('data-title');
    alert(`Proceeding to Buy: ${title}`);
  });

  overlay?.querySelector('.btn-outline-primary')?.addEventListener('click', function () {
    const title = overlay.getAttribute('data-title');
    const priceText = document.getElementById('overlayPrice').innerText;
    const img = overlay.getAttribute('data-img');
    addToCart(title, priceText, img);
  });

  overlay.querySelectorAll('.condition-option').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.condition-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const basePrice = parseInt(overlay.getAttribute('data-baseprice') || '0');
      let price = basePrice;
      switch (btn.dataset.condition) {
        case 'like-new': price = basePrice; break;
        case 'good': price = Math.round(basePrice * 0.95); break;
        case 'fair': price = Math.round(basePrice * 0.90); break;
      }
      document.getElementById('overlayPrice').innerText = `Price: ₹${price.toLocaleString()}`;
    });
  });

  document.querySelectorAll('.dropdown-menu button.dropdown-item').forEach(brand => {
  brand.style.cursor = 'pointer';
  brand.addEventListener('click', () => {
    const brandName = brand.innerText.trim().toLowerCase();
    const categoryType = brand.dataset.category || '';
    showBrandProducts(brandName, categoryType);
  });
});


  document.getElementById('searchInput')?.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
      card.style.display = title.includes(term) ? '' : 'none';
    });
  });

  document.getElementById('cartToggleBtn')?.addEventListener('click', toggleCartSidebar);
  document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);

  shuffleAndDisplay('phoneProducts', 'phoneContainer');
  shuffleAndDisplay('laptopProducts', 'laptopContainer');
  shuffleAndDisplay('tabletProducts', 'tabletContainer');
  shuffleAndDisplay('watchProducts', 'watchContainer');

  attachProductClickEvents();
  renderCartItems();

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  const user = sessionStorage.getItem('loggedInUser');

  if (!user) {
  alert('Please login to proceed with checkout.');
  sessionStorage.setItem('redirectToCheckout', 'true'); // set flag
  toggleLogin(true);
  return;
}
  // Continue with checkout logic
  alert('Proceeding to checkout...'); // You can replace this with redirect or confirmation
});

});

// === View All Overlay Filter Functionality ===
function applyOverlayFilters(section) {
  const overlay = document.getElementById(`${section}-overlay`);
  const allProducts = overlay.querySelectorAll('.product');

  const selectedBrands = Array.from(overlay.querySelectorAll('input[data-filter-type="brand"]:checked')).map(cb => cb.value);
  const selectedCategories = Array.from(overlay.querySelectorAll('input[data-filter-type="category"]:checked')).map(cb => cb.value);

  allProducts.forEach(prod => {
    const brand = prod.getAttribute('data-brand') || '';
    const category = prod.getAttribute('data-category') || '';
    const show = selectedBrands.includes(brand.toLowerCase()) && selectedCategories.includes(category.toLowerCase());
    prod.style.display = show ? 'flex' : 'none';
  });
}

// === Updated openOverlay() to load all products ===
function openOverlay(section) {
    const overlay = document.getElementById(`${section}-overlay`);
    const overlayProducts = document.getElementById(`${section}-overlay-products`);
    const templateId = `${section}Products`;
    const template = document.getElementById(templateId);
  
    if (!template || !overlay || !overlayProducts) return;
  
    overlayProducts.innerHTML = '';
    const allProducts = Array.from(template.content.cloneNode(true).children);
    allProducts.forEach(prod => {
      prod.classList.add('product');
      overlayProducts.appendChild(prod);
    });
  
    overlay.style.display = 'block';
    document.body.classList.add('no-scroll');
  
    attachProductClickEvents(); // ensure product click still works
    setupDynamicFilters(section, allProducts); // <- KEY LINE TO ENABLE FILTERS
  }
  
  
  // === Generate Dynamic Filters for Overlay ===
  function setupDynamicFilters(section, products) {
    const overlay = document.getElementById(`${section}-overlay`);
    const brandFilter = overlay.querySelector('.filter-brand');
    const categoryFilter = overlay.querySelector('.filter-category');
  
    if (!brandFilter || !categoryFilter) return;
  
    const brands = new Set();
    const categories = new Set();
  
    products.forEach(prod => {
      const brand = prod.dataset.brand?.toLowerCase() || '';
      const category = prod.dataset.category?.toLowerCase() || '';
      if (brand) brands.add(brand);
      if (category) categories.add(category);
    });
  
    brandFilter.innerHTML = '';
    brands.forEach(brand => {
      brandFilter.innerHTML += `
        <label><input type="checkbox" data-filter-type="brand" value="${brand}" checked> ${capitalize(brand)}</label><br>
      `;
    });
  
    categoryFilter.innerHTML = '';
    categories.forEach(cat => {
      categoryFilter.innerHTML += `
        <label><input type="checkbox" data-filter-type="category" value="${cat}" checked> ${capitalize(cat)}</label><br>
      `;
    });
  
    overlay.querySelectorAll('input[data-filter-type]').forEach(input => {
      input.addEventListener('change', () => applyOverlayFilters(section));
    });
  
    applyOverlayFilters(section);
  }
  
  // === Filter Products in Overlay Based on Checkboxes ===
  // === View All Overlay Filter Functionality (Apply Button Support) ===
  function applyOverlayFilters(section) {
    const overlay = document.getElementById(`${section}-overlay`);
    const allProducts = overlay.querySelectorAll('.product');
  
    const selectedBrands = Array.from(overlay.querySelectorAll('input[data-filter-type="brand"]:checked')).map(cb => cb.value);
    const selectedCategories = Array.from(overlay.querySelectorAll('input[data-filter-type="category"]:checked')).map(cb => cb.value);
  
    const minPrice = parseInt(overlay.querySelector('#priceMinRange')?.value || '0');
    const maxPrice = parseInt(overlay.querySelector('#priceMaxRange')?.value || '100000');
  
    allProducts.forEach(prod => {
      const brand = prod.getAttribute('data-brand') || '';
      const category = prod.getAttribute('data-category') || '';
      const priceText = prod.querySelector('.current-price')?.innerText.replace(/[₹,]/g, '') || '0';
      const price = parseInt(priceText);
  
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category.toLowerCase());
      const inPriceRange = price >= minPrice && price <= maxPrice;
  
      prod.style.display = (matchesBrand && matchesCategory && inPriceRange) ? 'flex' : 'none';
    });
  }
  // === Updated openOverlay() to load all products and setup filters ===
  function openOverlay(section) {
    const overlay = document.getElementById(`${section}-overlay`);
    const overlayProducts = document.getElementById(`${section}-overlay-products`);
    const templateId = `${section}Products`;
    const template = document.getElementById(templateId);
  
    if (!template || !overlay || !overlayProducts) return;
  
    overlayProducts.innerHTML = '';
    const allProducts = Array.from(template.content.cloneNode(true).children);
    allProducts.forEach(prod => {
      prod.classList.add('product');
      overlayProducts.appendChild(prod);
    });
  
    overlay.style.display = 'block';
    document.body.classList.add('no-scroll');
  
    attachProductClickEvents();
    setupDynamicFilters(section, allProducts);
  
    const applyBtn = overlay.querySelector('.apply-filters-btn');
    if (applyBtn) {
      applyBtn.onclick = () => applyOverlayFilters(section);
    }
   }
  
  // === Generate Dynamic Filters for Overlay ===
  function setupDynamicFilters(section, products) {
    const overlay = document.getElementById(`${section}-overlay`);
    const brandFilter = overlay.querySelector('.filter-brand');
    const categoryFilter = overlay.querySelector('.filter-category');
  
    if (!brandFilter || !categoryFilter) return;
  
    const brands = new Set();
    const categories = new Set();
  
    products.forEach(prod => {
      const brand = prod.dataset.brand?.toLowerCase() || '';
      const category = prod.dataset.category?.toLowerCase() || '';
      if (brand) brands.add(brand);
      if (category) categories.add(category);
    });
  
    brandFilter.innerHTML = '';
    brands.forEach(brand => {
      brandFilter.innerHTML += `
        <label><input type="checkbox" data-filter-type="brand" value="${brand}"> ${brand}</label><br>
      `;
    });
  
    categoryFilter.innerHTML = '';
    categories.forEach(category => {
      categoryFilter.innerHTML += `
        <label><input type="checkbox" data-filter-type="category" value="${category}"> ${category}</label><br>
      `;
    });

    document.getElementById('applyFilterBtn')?.addEventListener('click', function () {
        applyOverlayFilters(section);
      });
//price range sync logic//
const priceMinRange = overlay.querySelector('#priceMinRange');
const priceMaxRange = overlay.querySelector('#priceMaxRange');
const priceMinInput = overlay.querySelector('#priceMinInput');
const priceMaxInput = overlay.querySelector('#priceMaxInput');

if (priceMinRange && priceMaxRange && priceMinInput && priceMaxInput) {
  const syncAndFilter = () => {
    const min = parseInt(priceMinRange.value);
    const max = parseInt(priceMaxRange.value);
    priceMinInput.value = min;
    priceMaxInput.value = max;
    applyOverlayFilters(section);
  };

  priceMinRange.addEventListener('input', syncAndFilter);
  priceMaxRange.addEventListener('input', syncAndFilter);

  priceMinInput.addEventListener('change', () => {
    priceMinRange.value = priceMinInput.value;
    syncAndFilter();
  });
  priceMaxInput.addEventListener('change', () => {
    priceMaxRange.value = priceMaxInput.value;
    syncAndFilter();
  });
}

  }
  
  
  // === Utility ===
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  function closeOverlay(section) {
  const overlay = document.getElementById(`${section}-overlay`);
  if (overlay) overlay.style.display = 'none';
  document.body.classList.remove('no-scroll');
}
  
  // === Capitalize Utility ===
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  //Clear filters button logic//
  function clearOverlayFilters(section) {
    const overlay = document.getElementById(`${section}-overlay`);
    overlay.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  
    const minRange = overlay.querySelector('#priceMinRange');
    const maxRange = overlay.querySelector('#priceMaxRange');
    const minInput = overlay.querySelector('#priceMinInput');
    const maxInput = overlay.querySelector('#priceMaxInput');
  
    if (minRange && maxRange && minInput && maxInput) {
      minRange.value = 0;
      maxRange.value = 100000;
      minInput.value = 0;
      maxInput.value = 100000;
    }
  
    applyOverlayFilters(section);
  }
  //restore homepage after clicking title//
  function restoreHomepage() {
  document.getElementById('brandOverlay')?.classList.add('d-none');
  document.getElementById('productOverlay')?.classList.add('d-none');
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('section, .carousel-wrapper, .buying-section').forEach(el => el.style.display = '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// === Product Overlay: RAM + Storage + Color + Condition with Dynamic Price ===
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('productOverlay');
  if (!overlay) return;

  const ramOptions = [
    { size: '3GB', priceDelta: 0 },
    { size: '4GB', priceDelta: 500 },
    { size: '6GB', priceDelta: 1000 },
    { size: '8GB', priceDelta: 2000 },
    { size: '12GB', priceDelta: 3000 }
  ];

  const storageOptions = [
    { size: '32GB', priceDelta: 0, available: true },
    { size: '64GB', priceDelta: 500, available: true },
    { size: '128GB', priceDelta: 1000, available: true },
    { size: '256GB', priceDelta: 2000, available: true },
    { size: '512GB', priceDelta: 3000, available: false }
  ];

  const colorOptions = ['Black', 'White', 'Blue'];

  let selectedRam = '', selectedStorage = '', selectedColor = '', selectedCondition = '';
  let basePrice = parseInt(overlay?.getAttribute('data-baseprice')) || 15000;
  let ramDelta = 0, storageDelta = 0;

  const ramContainer = document.getElementById('ramOptions');
  const storageContainer = document.getElementById('storageOptions');
  const colorContainer = document.getElementById('colorOptions');
  const conditionContainer = document.getElementById('conditionOptions');
  const addToCartBtn = document.getElementById('addToCartBtn');

  function updateOverlayPrice() {
    let multiplier = 1;
    switch ((selectedCondition || '').toLowerCase()) {
      case 'very good': multiplier = 0.95; break;
      case 'good': multiplier = 0.90; break;
    }
    const final = Math.round((basePrice + ramDelta + storageDelta) * multiplier);
    const priceEl = document.getElementById('overlayPrice');
    if (priceEl) priceEl.innerText = `Price: ₹${final.toLocaleString()}`;
    return final;
  }

  function ensureSelections() {
    addToCartBtn.disabled = !(selectedRam && selectedStorage && selectedColor && selectedCondition);
  }

  // Render RAM Options
  if (ramContainer) {
    ramOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.size;
      btn.onclick = () => {
        selectedRam = opt.size;
        ramDelta = opt.priceDelta;
        document.querySelectorAll('#ramOptions .option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateOverlayPrice();
        ensureSelections();
      };
      ramContainer.appendChild(btn);
    });
  }

  // Render Storage Options
  if (storageContainer) {
    storageOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.size;
      if (!opt.available) {
        btn.disabled = true;
        btn.classList.add('disabled');
        btn.style.opacity = 0.5;
        btn.title = 'Currently unavailable';
      }
      btn.onclick = () => {
        selectedStorage = opt.size;
        storageDelta = opt.priceDelta;
        document.querySelectorAll('#storageOptions .option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateOverlayPrice();
        ensureSelections();
      };
      storageContainer.appendChild(btn);
    });
  }

  // Render Color Options
  if (colorContainer) {
    colorOptions.forEach((color, index) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.title = color;
      swatch.style.backgroundColor = color.toLowerCase();
      swatch.onclick = () => {
        selectedColor = color;
        document.querySelectorAll('#colorOptions .color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        ensureSelections();
      };
      colorContainer.appendChild(swatch);
      if (index === 0) swatch.click();
    });
  }

  // Render Condition Options
  if (conditionContainer) {
    conditionContainer.querySelectorAll('.option-btn').forEach((btn, index) => {
      btn.onclick = () => {
        selectedCondition = btn.dataset.condition;
        conditionContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateOverlayPrice();
        ensureSelections();
      };
      if (index === 0) btn.click();
    });
  }

  // Add to Cart Logic
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      const title = overlay.getAttribute('data-title');
      const img = overlay.getAttribute('data-img');
      const finalPrice = updateOverlayPrice();

      const cartItem = {
        title: `${title} (${selectedRam}, ${selectedStorage}, ${selectedColor}, ${selectedCondition})`,
        price: `₹${finalPrice}`,
        img: img,
        qty: 1
      };

      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingIndex = cartItems.findIndex(item => item.title === cartItem.title);
      if (existingIndex >= 0) {
        cartItems[existingIndex].qty += 1;
      } else {
        cartItems.push(cartItem);
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      const cartSidebar = document.getElementById('cartSidebar');
      if (cartSidebar && cartSidebar.classList.contains('d-none')) {
        cartSidebar.classList.remove('d-none');
      }

      if (typeof renderCartItems === 'function') renderCartItems();
      if (typeof showToast === 'function') showToast('Item added to cart.');
    };
  }
  renderSearchSuggestions();
});

/*searchbox*/
function renderSearchSuggestions() {
  const searchInput = document.querySelector('.search-bar input[type="search"]');
  if (!searchInput) return;

  const suggestionBox = document.createElement('div');
  suggestionBox.id = 'searchSuggestions';
  Object.assign(suggestionBox.style, {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    zIndex: '999',
    background: '#fff',
    border: '1px solid #ddd',
    maxHeight: '250px',
    overflowY: 'auto',
    borderTop: 'none',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    display: 'none'
  });

  searchInput.parentNode.style.position = 'relative';
  searchInput.parentNode.appendChild(suggestionBox);

  // Extract all products from template
  const allTemplates = document.querySelectorAll('template');
  let allProducts = [];

  allTemplates.forEach(template => {
    const clone = template.content.cloneNode(true);
    const cards = Array.from(clone.querySelectorAll('.product-card'));
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.innerText.trim();
      const price = card.querySelector('.current-price')?.innerText.trim();
      const img = card.querySelector('img')?.getAttribute('src');
      const brand = card.dataset.brand;
      const category = card.dataset.category;
      if (title && price && img && brand && category) {
        allProducts.push({ title, price, img, brand, category });
      }
    });
  });

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    suggestionBox.innerHTML = '';

    if (!term) {
      suggestionBox.style.display = 'none';
      return;
    }

    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
    if (filtered.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }

    filtered.forEach(({ title, price, img, brand, category }) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '10px';
      item.style.padding = '10px';
      item.style.cursor = 'pointer';
      item.style.borderBottom = '1px solid #eee';

      const thumbnail = document.createElement('img');
      thumbnail.src = img;
      thumbnail.style.width = '40px';
      thumbnail.style.height = '40px';
      thumbnail.style.borderRadius = '4px';
      thumbnail.style.objectFit = 'cover';

      const info = document.createElement('div');
      info.innerHTML = `<div style="font-weight: 500">${title}</div><div style="font-size: 0.9rem; color: gray">${price}</div>`;

      item.appendChild(thumbnail);
      item.appendChild(info);

      item.addEventListener('click', () => {
        suggestionBox.style.display = 'none';
        searchInput.value = title;

        showBrandProducts(brand.toLowerCase(), category.toLowerCase());

        setTimeout(() => {
          const productCards = document.querySelectorAll('#brandProductsContainer .product-card');
          productCards.forEach(card => {
            const cardTitle = card.querySelector('.card-title')?.innerText.toLowerCase();
            if (cardTitle && cardTitle.includes(title.toLowerCase())) {
              card.classList.add('highlight-product');
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });

              setTimeout(() => {
                card.classList.remove('highlight-product');
              }, 10000);
            }
          });
        }, 300);
      });

      suggestionBox.appendChild(item);
    });

    suggestionBox.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (!suggestionBox.contains(e.target) && e.target !== searchInput) {
      suggestionBox.style.display = 'none';
    }
  });
}
