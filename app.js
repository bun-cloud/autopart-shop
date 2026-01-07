/**
 * druzroadstar shop - Main Application JavaScript
 * Features: Dynamic inventory loading from products/ folder, smart search, filters
 */

// ========================================
// PRODUCT FILE MAPPING
// ========================================
// Maps product IDs to their corresponding filenames in the products/ folder
const PRODUCT_FILES = {
    1: 'brake-pad-set.json',
    2: 'brake-disc-kit.json',
    3: 'brake-caliper.json',
    4: 'oil-filter.json',
    5: 'cabin-air-filter.json',
    6: 'air-intake-filter.json',
    7: 'spark-plugs.json',
    8: 'timing-belt-kit.json',
    9: 'oil-pump.json',
    10: 'car-battery.json',
    11: 'alternator.json',
    12: 'led-headlight.json',
    13: 'headlight-bulb.json',
    14: 'tail-light.json',
    15: 'fog-light.json',
    16: 'strut-assembly.json',
    17: 'sway-bar-link.json',
    18: 'shock-absorber.json',
    19: 'brake-kit.json',
    20: 'fuel-filter.json',
    21: 'ignition-coil.json',
    22: 'power-steering-pump.json',
    23: 'starter-motor.json',
    24: 'control-arm.json',
    25: 'wheel-hub.json'
};

// ========================================
// INVENTORY DATABASE - Load from products/ folder
// ========================================
let inventory = [];

// ========================================
// APPLICATION STATE
// ========================================
let currentProduct = null;

// ========================================
// GENERATE PLACEHOLDER IMAGE
// ========================================
function generatePlaceholderImage(text) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23f5f5f5' font-size='12' font-family='Arial'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}

// ========================================
// INITIALIZATION
// ========================================
async function initializeApp() {
    try {
        // Fetch inventory from products/ folder (client-side aggregation)
        inventory = await loadAllProducts();
        
        if (inventory.length === 0) {
            throw new Error('No products found');
        }
        
        // Add images to products if they don't have them
        inventory = inventory.map(product => ({
            ...product,
            images: [product.images?.[0] || generatePlaceholderImage(product.name)]
        }));
        
        renderProducts();
        setupEventListeners();
        
        console.log(`✓ Loaded ${inventory.length} products from products/ folder`);
    } catch (error) {
        console.error('Error loading inventory:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="no-results" style="display: block;">
                <h3>Error Loading Products</h3>
                <p>Unable to load products from database.</p>
                <p style="font-size: 0.9rem; color: #8a8a8a; margin-top: 0.5rem;">Please try refreshing the page.</p>
            </div>
        `;
    }
}

// ========================================
// LOAD ALL PRODUCTS FROM products/ FOLDER
// ========================================
async function loadAllProducts() {
    const productIds = Object.keys(PRODUCT_FILES);
    const loadPromises = productIds.map(async (id) => {
        try {
            const filename = PRODUCT_FILES[id];
            const response = await fetch(`products/${filename}`);
            
            if (!response.ok) {
                console.warn(`Failed to load product ${id}: ${filename}`);
                return null;
            }
            
            const product = await response.json();
            return product;
        } catch (error) {
            console.warn(`Error loading product ${id}:`, error);
            return null;
        }
    });
    
    const results = await Promise.all(loadPromises);
    
    // Filter out any failed loads and sort by ID
    const products = results
        .filter(product => product !== null)
        .sort((a, b) => a.id - b.id);
    
    return products;
}

// ========================================
// PRODUCT RENDERING
// ========================================
function renderProducts(products = inventory) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        resultsCount.textContent = '0 parts found';
        return;
    }
    
    noResults.style.display = 'none';
    resultsCount.textContent = `${products.length} parts found`;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" onclick="showProductDetails(${product.id})">
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23242424%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%234a4a4a%22 font-size=%2240%22%3E%3F%3C/text%3E%3C/svg%3E'">
                ${product.sold ? '<span class="product-badge sold">SOLD</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="showProductDetails(${product.id})">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// SMART SEARCH & FILTERING
// ========================================
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = inventory;
    
    // Smart text search
    if (searchTerm) {
        filtered = filtered.filter(product => {
            const searchFields = [
                product.name,
                product.category,
                product.brand,
                product.description,
                product.partNumber || ''
            ].map(field => field.toLowerCase());
            
            return searchFields.some(field => field.includes(searchTerm));
        });
    }
    
    // Apply sorting
    const sortValue = document.getElementById('sortSelect').value;
    filtered = sortProducts(filtered, sortValue);
    
    renderProducts(filtered);
}

function sortProducts(products, sortValue) {
    const sorted = [...products];
    
    switch (sortValue) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// ========================================
// PRODUCT DETAILS MODAL
// ========================================
function showProductDetails(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('modalImage').src = product.images[0];
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalBrand').textContent = product.brand;
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Search
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Sort
    document.getElementById('sortSelect').addEventListener('change', performSearch);
    
    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('productModal')) {
            closeModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Make functions globally available
window.showProductDetails = showProductDetails;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
