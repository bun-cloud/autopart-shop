/**
 * druzroadstar shop - Admin Inventory Management
 * Features: Product CRUD, image upload, Netlify Identity authentication
 */

// ========================================
// NETLIFY IDENTITY AUTHENTICATION
// ========================================

let identityReady = false;
let identityInitAttempts = 0;
const MAX_INIT_ATTEMPTS = 50;

// Initialize Netlify Identity with proper widget loading
function initNetlifyIdentity() {
    showLoginInfo('Initializing authentication...');
    console.log('Starting Netlify Identity initialization...');
    
    // Function to initialize once widget is ready
    const doInit = () => {
        identityInitAttempts++;
        
        // Log what we have
        if (typeof netlifyIdentity === 'undefined') {
            console.log(`Attempt ${identityInitAttempts}: netlifyIdentity is undefined`);
        } else {
            console.log(`Attempt ${identityInitAttempts}: netlifyIdentity exists`);
            console.log('  - typeof init:', typeof netlifyIdentity.init);
            console.log('  - typeof open:', typeof netlifyIdentity.open);
            console.log('  - typeof currentUser:', typeof netlifyIdentity.currentUser);
        }
        
        if (typeof netlifyIdentity === 'undefined') {
            if (identityInitAttempts >= MAX_INIT_ATTEMPTS) {
                console.error('Netlify Identity failed to load after maximum attempts');
                showLoginError('Authentication system failed to load. Please refresh.');
                showAuthFallback();
                return;
            }
            // Try again in 200ms
            setTimeout(doInit, 200);
            return;
        }
        
        // Check if init is available
        if (typeof netlifyIdentity.init !== 'function') {
            console.log('netlifyIdentity.init is not a function yet');
            if (identityInitAttempts >= MAX_INIT_ATTEMPTS) {
                console.error('Netlify Identity init not available after maximum attempts');
                showLoginError('Authentication system not ready. Please refresh.');
                showAuthFallback();
                return;
            }
            // Try again in 200ms
            setTimeout(doInit, 200);
            return;
        }
        
        // Widget is ready!
        identityReady = true;
        console.log('✓ Netlify Identity widget ready');
        
        // Auto-detect site URL
        const SITE_URL = window.location.origin;
        console.log('Site URL:', SITE_URL);
        
        try {
            // Initialize Identity widget
            netlifyIdentity.init({
                APIUrl: `${SITE_URL}/.netlify/identity`,
                locale: 'en'
            });
            console.log('✓ Netlify Identity initialized successfully');
        } catch (e) {
            console.error('Error configuring Netlify Identity:', e);
            showLoginError('Error configuring authentication. Please refresh.');
            return;
        }
        
        // Handle login button click
        const loginBtn = document.getElementById('netlifyLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('Login button clicked');
                netlifyIdentity.open();
            });
        }
        
        // Handle manual login button (fallback for mobile)
        const manualLoginBtn = document.getElementById('manualLoginBtn');
        if (manualLoginBtn) {
            manualLoginBtn.addEventListener('click', () => {
                console.log('Manual login button clicked');
                netlifyIdentity.open();
            });
        }
        
        // Listen for init event
        netlifyIdentity.on('init', (user) => {
            console.log('Identity initialized', user ? `User: ${user.email}` : 'No user');
        });
        
        // Listen for login events
        netlifyIdentity.on('login', (user) => {
            console.log('Login success:', user.email);
            localStorage.setItem('adminUser', JSON.stringify({
                email: user.email,
                id: user.id,
                token: user.token,
                loggedInAt: new Date().toISOString()
            }));
            netlifyIdentity.close();
            showAdminPanel();
            showToast(`Welcome, ${user.email}!`);
        });
        
        // Listen for signup events (for invite acceptance)
        netlifyIdentity.on('signup', (user) => {
            console.log('Signup success:', user.email);
            localStorage.setItem('adminUser', JSON.stringify({
                email: user.email,
                id: user.id,
                token: user.token,
                loggedInAt: new Date().toISOString()
            }));
            netlifyIdentity.close();
            showAdminPanel();
            showToast(`Account created! Welcome, ${user.email}!`);
        });
        
        // Listen for logout events
        netlifyIdentity.on('logout', () => {
            console.log('User logged out');
            localStorage.removeItem('adminUser');
            showLoginScreen();
            showToast('You have been logged out');
        });
        
        // Listen for errors
        netlifyIdentity.on('error', (err) => {
            console.error('Identity error:', err);
            showLoginError(`Authentication error: ${err.message || 'Unknown error'}`);
            showAuthFallback();
        });
        
        // Check URL for invite token
        const hash = window.location.hash;
        console.log('Current URL hash:', hash);
        
        if (hash && (hash.includes('invite_token') || hash.includes('confirmation_token'))) {
            // User is clicking an invite link
            console.log('Invite token detected in URL');
            showLoginInfo('Processing invitation...');
            showAuthFallback();
            
            // Try to open the signup modal automatically
            setTimeout(() => {
                try {
                    netlifyIdentity.open('signup');
                } catch (e) {
                    console.warn('Could not auto-open signup modal:', e);
                }
            }, 500);
        }
        
        // Check if user is already logged in
        const currentUser = netlifyIdentity.currentUser();
        if (currentUser) {
            handleSuccessfulLogin(currentUser);
        } else {
            showLoginScreen();
        }
    };
    
    // Start initialization with a small delay to ensure script is parsed
    setTimeout(doInit, 50);
}

function handleSuccessfulLogin(user) {
    localStorage.setItem('adminUser', JSON.stringify({
        email: user.email,
        id: user.id,
        token: user.token,
        loggedInAt: new Date().toISOString()
    }));
    showAdminPanel();
    console.log(`Logged in as: ${user.email}`);
}

function checkAdminAuth() {
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Check if session is still valid (24 hour expiry)
        const loggedInAt = new Date(userData.loggedInAt);
        const now = new Date();
        const hoursSinceLogin = (now - loggedInAt) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
            // Session is valid
            showAdminPanel();
            return;
        } else {
            // Session expired
            localStorage.removeItem('adminUser');
            if (typeof netlifyIdentity !== 'undefined') {
                netlifyIdentity.logout();
            }
        }
    }
    
    // User is not logged in, show login overlay
    showLoginScreen();
}

function showLoginScreen() {
    const overlay = document.getElementById('loginOverlay');
    const body = document.getElementById('adminBody');
    const loginInfo = document.getElementById('loginInfo');
    const authFallback = document.getElementById('authFallback');
    
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    if (body) {
        body.classList.add('admin-locked');
    }
    if (loginInfo) {
        loginInfo.style.display = 'none';
    }
    if (authFallback) {
        authFallback.style.display = 'none';
    }
    
    // Hide error messages
    showLoginError('');
}

function showAuthFallback() {
    const authFallback = document.getElementById('authFallback');
    if (authFallback) {
        authFallback.style.display = 'block';
    }
}

function showLoginInfo(message) {
    const loginInfo = document.getElementById('loginInfo');
    if (loginInfo) {
        loginInfo.textContent = message;
        loginInfo.style.display = message ? 'block' : 'none';
    }
}

function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    const loginSubtitle = document.getElementById('loginSubtitle');
    
    if (loginError) {
        if (message) {
            loginError.textContent = message;
            loginError.style.display = 'block';
        } else {
            loginError.style.display = 'none';
        }
    }
    
    if (loginSubtitle) {
        if (message) {
            loginSubtitle.textContent = 'Authentication Failed';
        } else {
            loginSubtitle.textContent = 'Sign in with Netlify Identity';
        }
    }
}

function showAdminPanel() {
    const overlay = document.getElementById('loginOverlay');
    const body = document.getElementById('adminBody');
    
    if (overlay) {
        overlay.classList.add('hidden');
    }
    if (body) {
        body.classList.remove('admin-locked');
    }
}

// Logout function
function logout() {
    if (typeof netlifyIdentity !== 'undefined') {
        netlifyIdentity.logout();
    }
    localStorage.removeItem('adminUser');
    showLoginScreen();
}

// Get current user info
function getCurrentUser() {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    return null;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Netlify Identity is loaded
    setTimeout(() => {
        initNetlifyIdentity();
    }, 100);
});

// ========================================
// DATABASE INITIALIZATION
// ========================================
const defaultInventory = [
    // Brake System
    {
        id: 1,
        name: "Premium Ceramic Brake Pad Set",
        category: "Brake System",
        price: 45.99,
        brand: "Brembo",
        images: [generatePlaceholderImage("Brake Pads")],
        description: "High-performance ceramic brake pads designed for superior stopping power and reduced noise. Features low dust formulation for cleaner wheels."
    },
    {
        id: 2,
        name: "Vented Brake Disc Kit",
        category: "Brake System",
        price: 129.99,
        brand: "Brembo",
        images: [generatePlaceholderImage("Brake Disc")],
        description: "Precision-machined vented brake discs with superior heat dissipation. Drilled and slotted design for improved braking performance in all conditions."
    },
    {
        id: 3,
        name: "Performance Brake Caliper",
        category: "Brake System",
        price: 89.99,
        brand: "Monroe",
        images: [generatePlaceholderImage("Caliper")],
        description: "Premium brake caliper with stainless steel pistons. Features anti-rust coating and comes complete with mounting hardware."
    },
    
    // Filters
    {
        id: 4,
        name: "Premium Oil Filter",
        category: "Filters",
        price: 12.99,
        brand: "Bosch",
        images: [generatePlaceholderImage("Oil Filter")],
        description: "High-capacity oil filter with premium filtration media. Traps contaminants effectively and ensures optimal engine protection."
    },
    {
        id: 5,
        name: "Cabin Air Filter with Activated Carbon",
        category: "Filters",
        price: 24.99,
        brand: "Bosch",
        images: [generatePlaceholderImage("Cabin Filter")],
        description: "Multi-layer cabin air filter with activated carbon technology. Removes allergens, dust, and odors for cleaner cabin air."
    },
    {
        id: 6,
        name: "High-Performance Air Intake Filter",
        category: "Filters",
        price: 34.99,
        brand: "K&N",
        images: [generatePlaceholderImage("Air Filter")],
        description: "Washable and reusable high-flow air filter. Provides improved airflow and engine protection. Lifetime warranty included."
    },
    
    // Engine Parts
    {
        id: 7,
        name: "Iridium Spark Plug Set (4-Pack)",
        category: "Engine Parts",
        price: 39.99,
        brand: "NGK",
        images: [generatePlaceholderImage("Spark Plugs")],
        description: "Premium iridium spark plugs with trivalent metal plating. Provides excellent ignitability and extended service life up to 100,000 miles."
    },
    {
        id: 8,
        name: "Timing Belt Kit with Water Pump",
        category: "Engine Parts",
        price: 149.99,
        brand: "Gates",
        images: [generatePlaceholderImage("Timing Belt")],
        description: "Complete timing belt kit including tensioner, idler pulleys, and water pump. Designed for reliable performance and peace of mind."
    },
    {
        id: 9,
        name: "High-Volume Oil Pump",
        category: "Engine Parts",
        price: 79.99,
        brand: "Melling",
        images: [generatePlaceholderImage("Oil Pump")],
        description: "High-performance oil pump with increased flow rate. Features precision-machined components for reliable lubrication."
    },
    
    // Electrical
    {
        id: 10,
        name: "Premium AGM Car Battery",
        category: "Electrical",
        price: 199.99,
        brand: "DieHard",
        images: [generatePlaceholderImage("Battery")],
        description: "Absorbent Glass Mat (AGM) technology battery with 3-year free replacement warranty. Superior starting power and vibration resistance."
    },
    {
        id: 11,
        name: "Alternator - 160 Amp High Output",
        category: "Electrical",
        price: 189.99,
        brand: "Denso",
        images: [generatePlaceholderImage("Alternator")],
        description: "High-output 160 amp alternator for increased electrical demand vehicles. Features premium bearings and voltage regulation."
    },
    {
        id: 12,
        name: "LED Headlight Conversion Kit",
        category: "Electrical",
        price: 89.99,
        brand: "Philips",
        images: [generatePlaceholderImage("LED Lights")],
        description: "Plug-and-play LED conversion kit with 12,000 lumens output. Features integrated cooling fan and 50,000 hour lifespan."
    },
    
    // Lighting
    {
        id: 13,
        name: "Halogen Headlight Bulb - H11",
        category: "Lighting",
        price: 24.99,
        brand: "Philips",
        images: [generatePlaceholderImage("Headlight")],
        description: "Premium halogen headlight bulb with up to 150% brighter light. CO+Blue coating for improved visibility and style."
    },
    {
        id: 14,
        name: "LED Tail Light Assembly",
        category: "Lighting",
        price: 159.99,
        brand: "Philips",
        images: [generatePlaceholderImage("Tail Light")],
        description: "LED tail light assembly with sequential turn signals. Direct bolt-on replacement with premium finish."
    },
    {
        id: 15,
        name: "Fog Light Kit - LED",
        category: "Lighting",
        price: 69.99,
        brand: "PIAA",
        images: [generatePlaceholderImage("Fog Light")],
        description: "High-performance LED fog lights with yellow or white options. Impact-resistant polycarbonate lens."
    },
    
    // Suspension
    {
        id: 16,
        name: "Performance Strut Assembly",
        category: "Suspension",
        price: 189.99,
        brand: "Monroe",
        images: [generatePlaceholderImage("Strut")],
        description: "Complete strut assembly with spring and mount. Designed for improved handling and ride comfort. Pre-assembled for easy installation."
    },
    {
        id: 17,
        name: "Sway Bar Link Kit",
        category: "Suspension",
        price: 54.99,
        brand: "Moog",
        images: [generatePlaceholderImage("Sway Link")],
        description: "Premium sway bar link kit with greasable joints. Features corrosion-resistant hardware and precise fitment."
    },
    {
        id: 18,
        name: "Shock Absorber Set",
        category: "Suspension",
        price: 129.99,
        brand: "KYB",
        images: [generatePlaceholderImage("Shocks")],
        description: "Pair of premium shock absorbers with gas charge technology. Provides consistent damping and improved stability."
    },
    
    // Additional items for variety
    {
        id: 19,
        name: "Ceramic Brake Disc Pad Set",
        category: "Brake System",
        price: 79.99,
        brand: "Bosch",
        images: [generatePlaceholderImage("Brake Kit")],
        description: "Complete brake pad and rotor kit with hardware. Premium ceramic formula for low dust and quiet operation."
    },
    {
        id: 20,
        name: "Fuel Filter",
        category: "Filters",
        price: 18.99,
        brand: "Bosch",
        images: [generatePlaceholderImage("Fuel Filter")],
        description: "High-efficiency fuel filter with premium filtration media. Protects fuel injectors and ensures optimal fuel flow."
    },
    {
        id: 21,
        name: "Ignition Coil Pack",
        category: "Engine Parts",
        price: 109.99,
        brand: "NGK",
        images: [generatePlaceholderImage("Ignition Coil")],
        description: "Premium ignition coil pack with OE-matched design. Provides reliable spark for improved combustion and fuel economy."
    },
    {
        id: 22,
        name: "Power Steering Pump",
        category: "Engine Parts",
        price: 149.99,
        brand: "Cardone",
        images: [generatePlaceholderImage("Power Pump")],
        description: "Remanufactured power steering pump with premium seals. Includes reservoir where applicable for complete replacement."
    },
    {
        id: 23,
        name: "Starter Motor - High Torque",
        category: "Electrical",
        price: 169.99,
        brand: "Denso",
        images: [generatePlaceholderImage("Starter")],
        description: "High-torque starter motor for reliable starting in all conditions. Features premium bearings and solenoid."
    },
    {
        id: 24,
        name: "Control Arm Kit",
        category: "Suspension",
        price: 199.99,
        brand: "Moog",
        images: [generatePlaceholderImage("Control Arm")],
        description: "Complete control arm kit with ball joint and bushings. Precision-engineered for improved steering response and alignment."
    },
    {
        id: 25,
        name: "Wheel Hub Assembly",
        category: "Suspension",
        price: 119.99,
        brand: "Moog",
        images: [generatePlaceholderImage("Hub Assembly")],
        description: "Premium wheel hub assembly with integrated ABS sensor. Pre-adjusted bearings and seals for easy installation."
    }
];

function generatePlaceholderImage(text) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#242424" width="100" height="100"/><rect x="25" y="30" width="50" height="40" rx="5" fill="#4a4a4a"/><text x="50" y="55" text-anchor="middle" fill="#f5f5f5" font-size="8" font-family="Arial">${text}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ========================================
// STATE MANAGEMENT
// ========================================
let inventory = [];
let currentPage = 'dashboard';

function loadInventory() {
    const stored = localStorage.getItem('inventory_db');
    if (stored) {
        try {
            inventory = JSON.parse(stored);
            
            // Migrate old format to new format if needed
            if (inventory.length > 0 && inventory[0].hasOwnProperty('image') && !inventory[0].hasOwnProperty('images')) {
                inventory = inventory.map(product => ({
                    ...product,
                    images: [product.image]
                }));
                saveInventory();
            }
            
            // Ensure all products have the sold field
            let needsSave = false;
            inventory.forEach(product => {
                if (!product.hasOwnProperty('sold')) {
                    product.sold = false;
                    needsSave = true;
                }
            });
            if (needsSave) {
                saveInventory();
            }
        } catch (e) {
            console.error('Error parsing inventory from localStorage:', e);
            inventory = [...defaultInventory];
            saveInventory();
        }
    } else {
        inventory = [...defaultInventory];
        saveInventory();
    }
}

function resetDatabase() {
    // Clear localStorage and reload default inventory
    localStorage.removeItem('inventory_db');
    localStorage.removeItem('product_categories');
    inventory = [...defaultInventory];
    saveInventory();
    updateDashboard();
    renderProductsTable();
    updateCategoryDatalists();
    showToast('Database reset to default inventory!');
}

function saveInventory() {
    localStorage.setItem('inventory_db', JSON.stringify(inventory));
    // Also update the main app's inventory
    localStorage.setItem('cart_items', localStorage.getItem('cart_items') || '[]');
}

// ========================================
// PAGE NAVIGATION
// ========================================
function navigateTo(page) {
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-page').forEach(p => {
        p.classList.remove('active');
    });
    
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
    document.getElementById(`page-${page}`)?.classList.add('active');
    
    currentPage = page;
    
    if (page === 'dashboard') {
        updateDashboard();
    } else if (page === 'products') {
        renderProductsTable();
    }
}

// ========================================
// CATEGORY MANAGEMENT
// ========================================
const defaultCategories = [
    "Brake System",
    "Filters",
    "Engine Parts",
    "Electrical",
    "Lighting",
    "Suspension"
];

function loadCategories() {
    const stored = localStorage.getItem('product_categories');
    if (stored) {
        return JSON.parse(stored);
    }
    return [...defaultCategories];
}

function saveCategories(categories) {
    localStorage.setItem('product_categories', JSON.stringify(categories));
    updateCategoryDatalists();
}

function getCategories() {
    return loadCategories();
}

function updateCategoryDatalists() {
    const categories = getCategories();
    
    // Update the main category list
    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
        const options = categories.map(cat => `<option value="${cat}">`).join('');
        categoryList.innerHTML = options;
    }
    
    // Update the Add Product datalist
    const addDatalist = document.getElementById('categoryList');
    if (addDatalist) {
        addDatalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
    }
    
    // Update the Edit Product datalist
    const editDatalist = document.getElementById('editCategoryList');
    if (editDatalist) {
        editDatalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
    }
    
    // Update the category filter in products page
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        const firstOption = categoryFilter.options[0];
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }
}

function openCategoryManager() {
    renderCategoryList();
    document.getElementById('categoryManagerModal').classList.add('active');
}

function closeCategoryManager() {
    document.getElementById('categoryManagerModal').classList.remove('active');
    document.getElementById('newCategoryName').value = '';
}

function renderCategoryList() {
    const categories = getCategories();
    const container = document.getElementById('categoryList');
    
    if (categories.length === 0) {
        container.innerHTML = '<p class="category-empty">No categories added yet</p>';
        return;
    }
    
    container.innerHTML = categories.map((cat, index) => `
        <div class="category-item">
            <span class="category-item-name">${cat}</span>
            <div class="category-item-actions">
                <button class="category-item-btn" onclick="editCategory(${index})" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="category-item-btn delete" onclick="deleteCategory(${index})" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function addNewCategory() {
    const input = document.getElementById('newCategoryName');
    const name = input.value.trim();
    
    if (!name) {
        showToast('Please enter a category name');
        return;
    }
    
    const categories = getCategories();
    
    if (categories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
        showToast('This category already exists');
        return;
    }
    
    categories.push(name);
    saveCategories(categories);
    renderCategoryList();
    input.value = '';
    showToast('Category added successfully!');
}

function editCategory(index) {
    const categories = getCategories();
    const currentName = categories[index];
    const newName = prompt('Edit category name:', currentName);
    
    if (newName && newName.trim() !== '' && newName.trim() !== currentName) {
        const trimmedName = newName.trim();
        
        if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
            showToast('This category name already exists');
            return;
        }
        
        // Update existing products with the old category
        const oldName = categories[index];
        inventory.forEach(product => {
            if (product.category === oldName) {
                product.category = trimmedName;
            }
        });
        saveInventory();
        
        categories[index] = trimmedName;
        saveCategories(categories);
        renderCategoryList();
        updateDashboard();
        renderProductsTable();
        showToast('Category updated successfully!');
    }
}

function deleteCategory(index) {
    const categories = getCategories();
    const categoryName = categories[index];
    
    // Check if any products use this category
    const productsWithCategory = inventory.filter(p => p.category === categoryName);
    if (productsWithCategory.length > 0) {
        const confirmDelete = confirm(`${productsWithCategory.length} product(s) are using this category. Are you sure you want to delete it?`);
        if (!confirmDelete) return;
    }
    
    categories.splice(index, 1);
    saveCategories(categories);
    renderCategoryList();
    showToast('Category deleted successfully!');
}

// Make category functions globally available
window.openCategoryManager = openCategoryManager;
window.closeCategoryManager = closeCategoryManager;
window.addNewCategory = addNewCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;

// ========================================
// DASHBOARD
// ========================================
function updateDashboard() {
    // Calculate stats
    const totalProducts = inventory.length;
    const totalValue = inventory.reduce((sum, p) => sum + p.price, 0);
    
    // Update stat cards
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    
    // Render recent products (last 5)
    const recentProducts = [...inventory].slice(-5).reverse();
    const recentContainer = document.getElementById('recentProducts');
    recentContainer.innerHTML = recentProducts.map(product => `
        <div class="recent-item">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="recent-item-info">
                <div class="recent-item-name">${product.name}</div>
                <div class="recent-item-meta">${product.category} | $${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// ========================================
// PRODUCTS TABLE
// ========================================
function renderProductsTable(products = inventory) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    No products found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <input type="checkbox" class="product-checkbox" data-id="${product.id}" onchange="toggleProductSelection(${product.id})">
            </td>
            <td><img src="${product.images[0]}" alt="${product.name}"></td>
            <td><strong>${product.name}</strong></td>
            <td class="price">$${product.price.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editProduct(${product.id})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Update delete button visibility
    updateSelectedCount();
}

// ========================================
// MULTI-SELECT FUNCTIONS
// ========================================
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateSelectedCount();
}

function toggleProductSelection(productId) {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const someChecked = Array.from(checkboxes).some(cb => cb.checked);
    
    selectAllCheckbox.checked = allChecked;
    selectAllCheckbox.indeterminate = someChecked && !allChecked;
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    const count = checkboxes.length;
    const deleteBtn = document.getElementById('deleteSelectedBtn');
    const countSpan = document.getElementById('selectedCount');
    
    countSpan.textContent = count;
    deleteBtn.style.display = count > 0 ? 'flex' : 'none';
}

function deleteSelectedProducts() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    
    if (checkboxes.length === 0) {
        showToast('No products selected');
        return;
    }
    
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    const count = selectedIds.length;
    
    document.getElementById('deleteProductId').value = selectedIds.join(',');
    document.getElementById('deleteModalMessage').textContent = `Are you sure you want to delete ${count} product${count > 1 ? 's' : ''}? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('active');
}

// ========================================
// ADD PRODUCT
// ========================================
function handleProductSubmit(e) {
    e.preventDefault();
    
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        sold: document.getElementById('productSold').checked,
        description: document.getElementById('productDescription').value.trim(),
        images: tempImages.length > 0 ? [...tempImages] : [generatePlaceholderImage("Product")]
    };
    
    inventory.push(product);
    saveInventory();
    showToast('Product added successfully!');
    resetForm();
    updateDashboard();
}

function resetForm() {
    document.getElementById('productForm').reset();
    clearTempImages('add');
}

// ========================================
// EDIT PRODUCT
// ========================================
function editProduct(id) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductBrand').value = product.brand;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductSold').checked = product.sold || false;
    document.getElementById('editProductDescription').value = product.description;
    
    // Load product images
    loadProductImages(product.images || [product.image], 'edit');
    
    document.getElementById('editProductModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editProductModal').classList.remove('active');
    clearTempImages('edit');
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editProductId').value);
    const index = inventory.findIndex(p => p.id === id);
    if (index === -1) return;
    
    inventory[index] = {
        ...inventory[index],
        name: document.getElementById('editProductName').value.trim(),
        category: document.getElementById('editProductCategory').value,
        brand: document.getElementById('editProductBrand').value.trim(),
        price: parseFloat(document.getElementById('editProductPrice').value),
        sold: document.getElementById('editProductSold').checked,
        description: document.getElementById('editProductDescription').value.trim(),
        images: editTempImages.length > 0 ? [...editTempImages] : inventory[index].images
    };
    
    saveInventory();
    showToast('Product updated successfully!');
    closeEditModal();
    renderProductsTable();
    updateDashboard();
}

// ========================================
// DELETE PRODUCT
// ========================================
function deleteProduct(id) {
    document.getElementById('deleteProductId').value = id;
    document.getElementById('deleteModalMessage').textContent = 'Are you sure you want to delete this product? This action cannot be undone.';
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
}

function confirmDelete() {
    const deleteValue = document.getElementById('deleteProductId').value;
    
    // Check if it's bulk delete (comma-separated IDs)
    if (deleteValue.includes(',')) {
        const ids = deleteValue.split(',').map(id => parseInt(id.trim()));
        inventory = inventory.filter(p => !ids.includes(p.id));
        showToast(`${ids.length} products deleted successfully!`);
    } else {
        const id = parseInt(deleteValue);
        inventory = inventory.filter(p => p.id !== id);
        showToast('Product deleted successfully!');
    }
    
    // Save changes to localStorage
    saveInventory();
    
    closeDeleteModal();
    renderProductsTable();
    updateDashboard();
    
    // Reset select all checkbox
    document.getElementById('selectAllCheckbox').checked = false;
    document.getElementById('selectAllCheckbox').indeterminate = false;
}

// Make additional functions globally available
window.toggleSelectAll = toggleSelectAll;
window.toggleProductSelection = toggleProductSelection;
window.deleteSelectedProducts = deleteSelectedProducts;

// ========================================
// MULTI-IMAGE UPLOAD
// ========================================
// Store uploaded images temporarily
let tempImages = [];
let editTempImages = [];

function setupMultiImageUpload() {
    // Add Product Image Upload
    const addUploadArea = document.getElementById('imageUploadArea');
    const addFileInput = document.getElementById('productImage');
    const addContent = document.getElementById('imageUploadContent');
    const addPreviewContainer = document.getElementById('imagePreviewContainer');
    const addPreviewList = document.getElementById('imagePreviewList');
    const addMoreBtn = document.getElementById('addMoreImages');

    addUploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.image-preview-item') || e.target.closest('.add-more-images')) return;
        addFileInput.click();
    });

    addUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        addUploadArea.style.borderColor = 'var(--orange-accent)';
    });

    addUploadArea.addEventListener('dragleave', () => {
        addUploadArea.style.borderColor = 'var(--border-color)';
    });

    addUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        addUploadArea.style.borderColor = 'var(--border-color)';
        handleMultiImageFiles(e.dataTransfer.files, 'add');
    });

    addFileInput.addEventListener('change', (e) => {
        handleMultiImageFiles(e.target.files, 'add');
    });

    addMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addFileInput.click();
    });

    // Edit Product Image Upload
    const editUploadArea = document.getElementById('editImageUploadArea');
    const editFileInput = document.getElementById('editProductImage');
    const editContent = document.getElementById('editImageUploadContent');
    const editPreviewContainer = document.getElementById('editImagePreviewContainer');
    const editPreviewList = document.getElementById('editImagePreviewList');
    const editMoreBtn = document.getElementById('editAddMoreImages');

    editUploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.image-preview-item') || e.target.closest('.add-more-images')) return;
        editFileInput.click();
    });

    editUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        editUploadArea.style.borderColor = 'var(--orange-accent)';
    });

    editUploadArea.addEventListener('dragleave', () => {
        editUploadArea.style.borderColor = 'var(--border-color)';
    });

    editUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        editUploadArea.style.borderColor = 'var(--border-color)';
        handleMultiImageFiles(e.dataTransfer.files, 'edit');
    });

    editFileInput.addEventListener('change', (e) => {
        handleMultiImageFiles(e.target.files, 'edit');
    });

    editMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editFileInput.click();
    });
}

function handleMultiImageFiles(files, type) {
    const maxImages = 20;
    const currentImages = type === 'add' ? tempImages : editTempImages;

    if (currentImages.length >= maxImages) {
        showToast(`Maximum ${maxImages} images allowed`);
        return;
    }

    Array.from(files).forEach(file => {
        if (currentImages.length >= maxImages) return;
        if (!file.type.startsWith('image/')) {
            showToast('Please upload image files only');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImages.push(e.target.result);
            renderImagePreviews(type);
        };
        reader.readAsDataURL(file);
    });
}

function renderImagePreviews(type) {
    const currentImages = type === 'add' ? tempImages : editTempImages;
    const previewList = document.getElementById(type === 'add' ? 'imagePreviewList' : 'editImagePreviewList');
    const previewContainer = document.getElementById(type === 'add' ? 'imagePreviewContainer' : 'editImagePreviewContainer');
    const uploadContent = document.getElementById(type === 'add' ? 'imageUploadContent' : 'editImageUploadContent');

    if (currentImages.length === 0) {
        previewContainer.style.display = 'none';
        uploadContent.style.display = 'block';
        return;
    }

    previewContainer.style.display = 'flex';
    uploadContent.style.display = 'none';

    previewList.innerHTML = currentImages.map((img, index) => `
        <div class="image-preview-item ${index === 0 ? 'primary' : ''}" data-index="${index}">
            <img src="${img}" alt="Image ${index + 1}">
            <button class="remove-image" onclick="removeImage(${index}, '${type}')">&times;</button>
            ${index !== 0 ? `<button class="set-primary" onclick="setPrimaryImage(${index}, '${type}')">Set Primary</button>` : ''}
        </div>
    `).join('');
}

function removeImage(index, type) {
    const currentImages = type === 'add' ? tempImages : editTempImages;
    currentImages.splice(index, 1);
    renderImagePreviews(type);
}

function setPrimaryImage(index, type) {
    const currentImages = type === 'add' ? tempImages : editTempImages;
    const image = currentImages.splice(index, 1)[0];
    currentImages.unshift(image);
    renderImagePreviews(type);
}

function clearTempImages(type) {
    if (type === 'add') {
        tempImages = [];
    } else {
        editTempImages = [];
    }
    renderImagePreviews(type);
}

function loadProductImages(images, type) {
    const currentImages = type === 'add' ? tempImages : editTempImages;
    currentImages.length = 0;
    currentImages.push(...images);
    renderImagePreviews(type);
}

// Make functions globally available
window.removeImage = removeImage;
window.setPrimaryImage = setPrimaryImage;

// ========================================
// SEARCH & FILTER
// ========================================
function setupSearchAndFilter() {
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter ? categoryFilter.value : '';
        
        let filtered = inventory;
        
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }
        
        renderProductsTable(filtered);
    }
    
    searchInput.addEventListener('input', filterProducts);
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

// ========================================
// EXPORT TO CSV (GOOGLE SHEETS)
// ========================================
function exportToCSV() {
    // Get current inventory
    const stored = localStorage.getItem('inventory_db');
    const inventory = stored ? JSON.parse(stored) : [...defaultInventory];
    
    if (inventory.length === 0) {
        showToast('No products to export');
        return;
    }
    
    // Define CSV headers - only ID, Name, and Price
    const headers = ['Product ID', 'Product Name', 'Price'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    inventory.forEach(product => {
        const row = [
            product.id,
            `"${product.name.replace(/"/g, '""')}"`,
            product.price
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exported ${inventory.length} products to CSV`);
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message) {
    const toast = document.getElementById('adminToast');
    const toastMessage = document.getElementById('adminToastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    updateCategoryDatalists();
    updateDashboard();
    
    // Navigation
    document.querySelectorAll('.admin-nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
    
    // Forms
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('editProductForm').addEventListener('submit', handleEditSubmit);
    
    // Image upload
    setupMultiImageUpload();
    
    // Search and filter
    setupSearchAndFilter();
    
    // Category manager - Enter key handler
    document.getElementById('newCategoryName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewCategory();
        }
    });
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEditModal();
            closeDeleteModal();
            closeCategoryManager();
        }
    });
});

// Make functions globally available
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.resetForm = resetForm;
window.resetDatabase = resetDatabase;
window.exportToCSV = exportToCSV;
