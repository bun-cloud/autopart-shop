/**
 * druzroadstar shop - Main Application JavaScript
 * Features: Loads inventory from Supabase (cloud database)
 */

// ========================================
// INVENTORY DATABASE - Load from Supabase
// ========================================
let inventory = [];
let currentProduct = null;

// ========================================
// GENERATE PLACEHOLDER IMAGE
// ========================================
function generatePlaceholderImage(text) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23f5f5f5' font-size='12' font-family='Arial'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}

// ========================================
// LOAD INVENTORY FROM SUPABASE
// ========================================
async function loadInventory() {
    if (!supabaseReady) {
        console.log('Waiting for Supabase...');
        let attempts = 0;
        while (!window.supabaseReady && attempts < 50) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
        }
    }
    
    try {
        // Fetch products from Supabase
        const { data: products, error } = await supabase
            .from('products')
            .select('*');
        
        if (error) {
            console.error('Error loading from Supabase:', error);
            inventory = [];
        } else {
            inventory = products || [];
        }
        
        console.log(`✓ Loaded ${inventory.length} products from Supabase`);
    } catch (err) {
        console.error('Unexpected error loading inventory:', err);
        inventory = [];
    }
}

// ========================================
// INITIALIZATION
// ========================================
async function initializeApp() {
    await loadInventory();
    renderProducts();
    setupEventListeners();
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
    
    grid.innerHTML = products.map(product => {
        // Ensure images array exists and has at least one image
        const imageUrl = (product.images && product.images.length > 0) 
            ? product.images[0] 
            : generatePlaceholderImage(product.name || 'Product');
        
        return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" onclick="showProductDetails(${product.id})">
                <img src="${imageUrl}" alt="${product.name || 'Product'}" onerror="this.src='${generatePlaceholderImage('Product')}'">
                ${product.sold ? '<span class="product-badge sold">SOLD</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="showProductDetails(${product.id})">${product.name || 'Unnamed Product'}</h3>
                <div class="product-footer">
                    ${product.sold 
                        ? '<span class="product-price sold-price">SOLD</span>'
                        : `<span class="product-price">$${(product.price || 0).toFixed(2)}</span>`
                    }
                </div>
            </div>
        </div>
    `}).join('');
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
                product.name || '',
                product.category || '',
                product.brand || '',
                product.description || ''
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
            return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        case 'price-high':
            return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        case 'name':
            return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        default:
            return sorted;
    }
}

// ========================================
// PRODUCT DETAILS MODAL - MULTIPLE IMAGES
// ========================================

// Global variable to track current image index
let currentImageIndex = 0;
let currentProductImages = [];

function showProductDetails(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Get product images or generate placeholder
    currentProductImages = (product.images && product.images.length > 0) 
        ? product.images 
        : [generatePlaceholderImage(product.name || 'Product')];
    
    currentImageIndex = 0;
    
    // Update main image
    document.getElementById('modalImage').src = currentProductImages[0];
    
    // Update counter
    updateImageCounter();
    
    // Show/hide navigation buttons
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');
    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentProductImages.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentProductImages.length > 1 ? 'flex' : 'none';
    }
    
    // Build thumbnail gallery
    buildThumbnails();
    
    document.getElementById('modalCategory').textContent = product.category || 'Uncategorized';
    document.getElementById('modalName').innerHTML = (product.name || 'Unnamed Product') + (product.sold ? ' <span class="product-badge sold">SOLD</span>' : '');
    document.getElementById('modalPrice').textContent = product.sold ? 'SOLD' : `$${(product.price || 0).toFixed(2)}`;
    document.getElementById('modalPrice').style.color = product.sold ? '#ef4444' : '';
    document.getElementById('modalDescription').textContent = product.description || 'No description available.';
    document.getElementById('modalBrand').textContent = product.brand || 'Unknown';
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function navigateImage(direction) {
    if (currentProductImages.length <= 1) return;
    
    currentImageIndex += direction;
    
    // Wrap around
    if (currentImageIndex < 0) {
        currentImageIndex = currentProductImages.length - 1;
    } else if (currentImageIndex >= currentProductImages.length) {
        currentImageIndex = 0;
    }
    
    document.getElementById('modalImage').src = currentProductImages[currentImageIndex];
    updateImageCounter();
    updateThumbnailSelection();
}

function updateImageCounter() {
    const counter = document.getElementById('imageCounter');
    if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${currentProductImages.length}`;
    }
}

function buildThumbnails() {
    const container = document.getElementById('modalThumbnails');
    if (!container) return;
    
    if (currentProductImages.length <= 1) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = currentProductImages.map((img, index) => `
        <div class="modal-thumbnail ${index === currentImageIndex ? 'active' : ''}" 
             onclick="goToImage(${index})">
            <img src="${img}" alt="Thumbnail ${index + 1}">
        </div>
    `).join('');
}

function goToImage(index) {
    if (index >= 0 && index < currentProductImages.length) {
        currentImageIndex = index;
        document.getElementById('modalImage').src = currentProductImages[currentImageIndex];
        updateImageCounter();
        updateThumbnailSelection();
    }
}

function updateThumbnailSelection() {
    const container = document.getElementById('modalThumbnails');
    if (!container) return;
    
    const thumbnails = container.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
    currentProductImages = [];
    currentImageIndex = 0;
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
window.navigateImage = navigateImage;
window.goToImage = goToImage;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
