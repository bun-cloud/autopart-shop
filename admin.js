/**
 * druzroadstar shop - Admin Inventory Management
 * Features: Product CRUD, image upload, simple password authentication
 */

// ========================================
// SIMPLE PASSWORD AUTHENTICATION
// ========================================

// Hardcoded password - CHANGE THIS TO YOUR OWN PASSWORD
const ADMIN_PASSWORD = 'admin123';

// Initialize password authentication on page load
function initAuth() {
    console.log('Initializing simple password authentication...');
    
    // Check if already logged in
    checkLoginStatus();
    
    // Handle Enter key on password field
    const passwordField = document.getElementById('adminPassword');
    if (passwordField) {
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                attemptLogin();
            }
        });
    }
}

// Attempt to login
function attemptLogin() {
    const passwordField = document.getElementById('adminPassword');
    if (!passwordField) return;
    
    const password = passwordField.value;
    
    if (!password) {
        showLoginError('Please enter the password');
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        // Login successful
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoggedInAt', new Date().toISOString());
        
        console.log('Login successful');
        showAdminPanel();
        showToast('Welcome back!');
    } else {
        // Login failed
        showLoginError('Incorrect password');
        console.log('Login failed - incorrect password');
    }
}

// Check if user is already logged in
function checkLoginStatus() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const loggedInAt = localStorage.getItem('adminLoggedInAt');
    
    if (loggedIn && loggedInAt) {
        // Check if session is still valid (7 days)
        const loggedInTime = new Date(loggedInAt);
        const now = new Date();
        const hoursSinceLogin = (now - loggedInTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 168) { // 7 days
            // Session is valid
            showAdminPanel();
            return;
        } else {
            // Session expired
            logout();
        }
    }
    
    // Not logged in, show login screen
    showLoginScreen();
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoggedInAt');
    showLoginScreen();
    showToast('You have been logged out');
}

// Show login screen
function showLoginScreen() {
    const overlay = document.getElementById('loginOverlay');
    const body = document.getElementById('adminBody');
    
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    if (body) {
        body.classList.add('admin-locked');
    }
    
    // Clear password field and show error
    const passwordField = document.getElementById('adminPassword');
    if (passwordField) {
        passwordField.value = '';
        passwordField.focus();
    }
    
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.style.display = 'none';
    }
}

// Show admin panel
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

// Show login error
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
            loginSubtitle.textContent = 'Access Denied';
        } else {
            loginSubtitle.textContent = 'Enter Password to Access';
        }
    }
}

// Show login info
function showLoginInfo(message) {
    const loginInfo = document.getElementById('loginInfo');
    if (loginInfo) {
        loginInfo.textContent = message;
        loginInfo.style.display = message ? 'block' : 'none';
    }
}

// ========================================
// DATABASE INITIALIZATION
// ========================================
const defaultInventory = [
    // Brake System
    {
        id: 1,
        name: "Premium Ceramic Brake Pad Set",
        category: "Brake System",
        partNumber: "BRK-CER-001",
        price: 45.99,
        brand: "Brembo",
        stock: 48,
        image: generatePlaceholderImage("Brake Pads"),
        compatibility: ["Toyota Camry 2020-2023", "Honda Accord 2019-2022", "Nissan Altima 2020-2023"],
        description: "High-performance ceramic brake pads designed for superior stopping power and reduced noise. Features low dust formulation for cleaner wheels."
    },
    {
        id: 2,
        name: "Vented Brake Disc Kit",
        category: "Brake System",
        partNumber: "BRK-DSC-002",
        price: 129.99,
        brand: "Brembo",
        stock: 32,
        image: generatePlaceholderImage("Brake Disc"),
        compatibility: ["Ford Mustang 2018-2023", "Chevrolet Camaro 2020-2023", "Dodge Challenger 2020-2023"],
        description: "Precision-machined vented brake discs with superior heat dissipation. Drilled and slotted design for improved braking performance in all conditions."
    },
    {
        id: 3,
        name: "Performance Brake Caliper",
        category: "Brake System",
        partNumber: "BRK-CAL-003",
        price: 89.99,
        brand: "Monroe",
        stock: 24,
        image: generatePlaceholderImage("Caliper"),
        compatibility: ["Toyota Camry 2020-2023", "Honda Accord 2019-2022", "Subaru Legacy 2020-2023"],
        description: "Premium brake caliper with stainless steel pistons. Features anti-rust coating and comes complete with mounting hardware."
    },
    
    // Filters
    {
        id: 4,
        name: "Premium Oil Filter",
        category: "Filters",
        partNumber: "FIL-OIL-001",
        price: 12.99,
        brand: "Bosch",
        stock: 150,
        image: generatePlaceholderImage("Oil Filter"),
        compatibility: ["Universal Fit - Check Vehicle"],
        description: "High-capacity oil filter with premium filtration media. Traps contaminants effectively and ensures optimal engine protection."
    },
    {
        id: 5,
        name: "Cabin Air Filter with Activated Carbon",
        category: "Filters",
        partNumber: "FIL-CAB-002",
        price: 24.99,
        brand: "Bosch",
        stock: 85,
        image: generatePlaceholderImage("Cabin Filter"),
        compatibility: ["Toyota Camry 2018-2023", "Honda Accord 2018-2022", "Ford Fusion 2019-2020"],
        description: "Multi-layer cabin air filter with activated carbon technology. Removes allergens, dust, and odors for cleaner cabin air."
    },
    {
        id: 6,
        name: "High-Performance Air Intake Filter",
        category: "Filters",
        partNumber: "FIL-AIR-003",
        price: 34.99,
        brand: "K&N",
        stock: 62,
        image: generatePlaceholderImage("Air Filter"),
        compatibility: ["Ford Mustang 2018-2023", "Chevrolet Camaro 2020-2023", "BMW 3 Series 2019-2023"],
        description: "Washable and reusable high-flow air filter. Provides improved airflow and engine protection. Lifetime warranty included."
    },
    
    // Engine Parts
    {
        id: 7,
        name: "Iridium Spark Plug Set (4-Pack)",
        category: "Engine Parts",
        partNumber: "ENG-SPK-001",
        price: 39.99,
        brand: "NGK",
        stock: 120,
        image: generatePlaceholderImage("Spark Plugs"),
        compatibility: ["Toyota Camry 2020-2023", "Honda Civic 2019-2023", "Ford Escape 2020-2022"],
        description: "Premium iridium spark plugs with trivalent metal plating. Provides excellent ignitability and extended service life up to 100,000 miles."
    },
    {
        id: 8,
        name: "Timing Belt Kit with Water Pump",
        category: "Engine Parts",
        partNumber: "ENG-TIM-002",
        price: 149.99,
        brand: "Gates",
        stock: 28,
        image: generatePlaceholderImage("Timing Belt"),
        compatibility: ["Toyota Camry 2015-2017", "Honda Accord 2014-2017", "Nissan Rogue 2017-2020"],
        description: "Complete timing belt kit including tensioner, idler pulleys, and water pump. Designed for reliable performance and peace of mind."
    },
    {
        id: 9,
        name: "High-Volume Oil Pump",
        category: "Engine Parts",
        partNumber: "ENG-OIL-003",
        price: 79.99,
        brand: "Melling",
        stock: 18,
        image: generatePlaceholderImage("Oil Pump"),
        compatibility: ["Ford Mustang 2018-2023", "Chevrolet Silverado 2019-2023", "GM Vehicles V8"],
        description: "High-performance oil pump with increased flow rate. Features precision-machined components for reliable lubrication."
    },
    
    // Electrical
    {
        id: 10,
        name: "Premium AGM Car Battery",
        category: "Electrical",
        partNumber: "ELC-BAT-001",
        price: 199.99,
        brand: "DieHard",
        stock: 35,
        image: generatePlaceholderImage("Battery"),
        compatibility: ["Universal - Group Size 24/24F"],
        description: "Absorbent Glass Mat (AGM) technology battery with 3-year free replacement warranty. Superior starting power and vibration resistance."
    },
    {
        id: 11,
        name: "Alternator - 160 Amp High Output",
        category: "Electrical",
        partNumber: "ELC-ALT-002",
        price: 189.99,
        brand: "Denso",
        stock: 22,
        image: generatePlaceholderImage("Alternator"),
        compatibility: ["Ford F-150 2018-2023", "Ford Expedition 2018-2023", "Lincoln Navigator 2018-2023"],
        description: "High-output 160 amp alternator for increased electrical demand vehicles. Features premium bearings and voltage regulation."
    },
    {
        id: 12,
        name: "LED Headlight Conversion Kit",
        category: "Electrical",
        partNumber: "ELC-LED-003",
        price: 89.99,
        brand: "Philips",
        stock: 45,
        image: generatePlaceholderImage("LED Lights"),
        compatibility: ["H11 Bulb Type", "9005 Bulb Type", "9006 Bulb Type"],
        description: "Plug-and-play LED conversion kit with 12,000 lumens output. Features integrated cooling fan and 50,000 hour lifespan."
    },
    
    // Lighting
    {
        id: 13,
        name: "Halogen Headlight Bulb - H11",
        category: "Lighting",
        partNumber: "LGT-HAL-001",
        price: 24.99,
        brand: "Philips",
        stock: 95,
        image: generatePlaceholderImage("Headlight"),
        compatibility: ["Toyota Camry 2018-2023", "Honda Accord 2018-2022", "Nissan Altima 2019-2023"],
        description: "Premium halogen headlight bulb with up to 150% brighter light. CO+Blue coating for improved visibility and style."
    },
    {
        id: 14,
        name: "LED Tail Light Assembly",
        category: "Lighting",
        partNumber: "LGT-LED-002",
        price: 159.99,
        brand: "Philips",
        stock: 28,
        image: generatePlaceholderImage("Tail Light"),
        compatibility: ["Ford Mustang 2018-2023", "Chevrolet Camaro 2020-2023", "Dodge Challenger 2020-2023"],
        description: "LED tail light assembly with sequential turn signals. Direct bolt-on replacement with premium finish."
    },
    {
        id: 15,
        name: "Fog Light Kit - LED",
        category: "Lighting",
        partNumber: "LGT-FOG-003",
        price: 69.99,
        brand: "PIAA",
        stock: 42,
        image: generatePlaceholderImage("Fog Light"),
        compatibility: ["Universal Fit - 3 Inch Round", "Toyota Tacoma 2016-2023", "Jeep Wrangler 2018-2023"],
        description: "High-performance LED fog lights with yellow or white options. Impact-resistant polycarbonate lens."
    },
    
    // Suspension
    {
        id: 16,
        name: "Performance Strut Assembly",
        category: "Suspension",
        partNumber: "SUS-STR-001",
        price: 189.99,
        brand: "Monroe",
        stock: 32,
        image: generatePlaceholderImage("Strut"),
        compatibility: ["Toyota Camry 2018-2023", "Honda Accord 2018-2022", "Nissan Altima 2019-2023"],
        description: "Complete strut assembly with spring and mount. Designed for improved handling and ride comfort. Pre-assembled for easy installation."
    },
    {
        id: 17,
        name: "Sway Bar Link Kit",
        category: "Suspension",
        partNumber: "SUS-SWY-002",
        price: 54.99,
        brand: "Moog",
        stock: 65,
        image: generatePlaceholderImage("Sway Link"),
        compatibility: ["Ford F-150 2018-2023", "Ford Expedition 2018-2023", "Lincoln Navigator 2018-2023"],
        description: "Premium sway bar link kit with greasable joints. Features corrosion-resistant hardware and precise fitment."
    },
    {
        id: 18,
        name: "Shock Absorber Set",
        category: "Suspension",
        partNumber: "SUS-SHK-003",
        price: 129.99,
        brand: "KYB",
        stock: 38,
        image: generatePlaceholderImage("Shocks"),
        compatibility: ["Honda Civic 2016-2023", "Toyota Corolla 2019-2023", "Mazda3 2019-2023"],
        description: "Pair of premium shock absorbers with gas charge technology. Provides consistent damping and improved stability."
    },
    
    // Additional items for variety
    {
        id: 19,
        name: "Ceramic Brake Disc Pad Set",
        category: "Brake System",
        partNumber: "BRK-KIT-004",
        price: 79.99,
        brand: "Bosch",
        stock: 55,
        image: generatePlaceholderImage("Brake Kit"),
        compatibility: ["BMW 3 Series 2019-2023", "Mercedes C-Class 2020-2023", "Audi A4 2020-2023"],
        description: "Complete brake pad and rotor kit with hardware. Premium ceramic formula for low dust and quiet operation."
    },
    {
        id: 20,
        name: "Fuel Filter",
        category: "Filters",
        partNumber: "FIL-FUEL-004",
        price: 18.99,
        brand: "Bosch",
        stock: 78,
        image: generatePlaceholderImage("Fuel Filter"),
        compatibility: ["Ford F-150 2018-2023", "Ford Explorer 2020-2023", "Lincoln Aviator 2020-2023"],
        description: "High-efficiency fuel filter with premium filtration media. Protects fuel injectors and ensures optimal fuel flow."
    },
    {
        id: 21,
        name: "Ignition Coil Pack",
        category: "Engine Parts",
        partNumber: "ENG-IGN-004",
        price: 109.99,
        brand: "NGK",
        stock: 42,
        image: generatePlaceholderImage("Ignition Coil"),
        compatibility: ["Toyota Camry 2020-2023", "Honda Accord 2019-2022", "Lexus ES 2020-2023"],
        description: "Premium ignition coil pack with OE-matched design. Provides reliable spark for improved combustion and fuel economy."
    },
    {
        id: 22,
        name: "Power Steering Pump",
        category: "Engine Parts",
        partNumber: "ENG-STR-005",
        price: 149.99,
        brand: "Cardone",
        stock: 25,
        image: generatePlaceholderImage("Power Pump"),
        compatibility: ["Chevrolet Silverado 2019-2023", "GMC Sierra 2019-2023", "Ram 1500 2019-2023"],
        description: "Remanufactured power steering pump with premium seals. Includes reservoir where applicable for complete replacement."
    },
    {
        id: 23,
        name: "Starter Motor - High Torque",
        category: "Electrical",
        partNumber: "ELC-STR-004",
        price: 169.99,
        brand: "Denso",
        stock: 30,
        image: generatePlaceholderImage("Starter"),
        compatibility: ["Ford F-150 2018-2023", "Ford Mustang 2018-2023", "Ford Expedition 2018-2023"],
        description: "High-torque starter motor for reliable starting in all conditions. Features premium bearings and solenoid."
    },
    {
        id: 24,
        name: "Control Arm Kit",
        category: "Suspension",
        partNumber: "SUS-CTL-004",
        price: 199.99,
        brand: "Moog",
        stock: 22,
        image: generatePlaceholderImage("Control Arm"),
        compatibility: ["Toyota Camry 2018-2023", "Honda Accord 2018-2022", "Lexus ES 2020-2023"],
        description: "Complete control arm kit with ball joint and bushings. Precision-engineered for improved steering response and alignment."
    },
    {
        id: 25,
        name: "Wheel Hub Assembly",
        category: "Suspension",
        partNumber: "SUS-WHL-005",
        price: 119.99,
        brand: "Moog",
        stock: 36,
        image: generatePlaceholderImage("Hub Assembly"),
        compatibility: ["Toyota Camry 2018-2023", "Honda Accord 2018-2022", "Nissan Altima 2019-2023"],
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
        inventory = JSON.parse(stored);
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
    const lowStock = inventory.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = inventory.filter(p => p.stock === 0).length;
    const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    // Update stat cards
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    
    // Render recent products (last 5)
    const recentProducts = [...inventory].slice(-5).reverse();
    const recentContainer = document.getElementById('recentProducts');
    recentContainer.innerHTML = recentProducts.map(product => `
        <div class="recent-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="recent-item-info">
                <div class="recent-item-name">${product.name}</div>
                <div class="recent-item-meta">${product.category} | $${product.price.toFixed(2)}</div>
            </div>
            <span class="stock-badge ${product.stock === 0 ? 'out-of-stock' : product.stock <= 10 ? 'low-stock' : 'in-stock'}">
                ${product.stock} in stock
            </span>
        </div>
    `).join('');
    
    // Render low stock items
    const lowStockItems = inventory.filter(p => p.stock <= 10 && p.stock > 0);
    const lowStockContainer = document.getElementById('lowStockList');
    if (lowStockItems.length === 0) {
        lowStockContainer.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">No low stock items</p>';
    } else {
        lowStockContainer.innerHTML = lowStockItems.map(product => `
            <div class="low-stock-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="low-stock-item-info">
                    <div class="recent-item-name">${product.name}</div>
                    <div class="recent-item-meta">${product.brand}</div>
                </div>
                <span class="stock-badge low-stock">${product.stock} left</span>
            </div>
        `).join('');
    }
}

// ========================================
// PRODUCTS TABLE
// ========================================
function renderProductsTable(products = inventory) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
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
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td><strong>${product.name}</strong></td>
            <td><code>${product.partNumber}</code></td>
            <td>${product.category}</td>
            <td class="price">$${product.price.toFixed(2)}</td>
            <td class="stock ${product.stock === 0 ? 'out-of-stock' : product.stock <= 10 ? 'low-stock' : ''}">
                ${product.stock}
            </td>
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
        partNumber: document.getElementById('productSKU').value.trim().toUpperCase(),
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value.trim(),
        compatibility: document.getElementById('productCompatibility').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0),
        image: document.getElementById('imagePreview').src || generatePlaceholderImage("Product")
    };
    
    inventory.push(product);
    saveInventory();
    showToast('Product added successfully!');
    resetForm();
    updateDashboard();
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageUploadContent').style.display = 'block';
}

// ========================================
// EDIT PRODUCT
// ========================================
function editProduct(id) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductSKU').value = product.partNumber;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductBrand').value = product.brand;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductCompatibility').value = product.compatibility.join('\n');
    
    const imagePreview = document.getElementById('editImagePreview');
    imagePreview.src = product.image;
    imagePreview.style.display = 'block';
    
    document.getElementById('editProductModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editProductModal').classList.remove('active');
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editProductId').value);
    const index = inventory.findIndex(p => p.id === id);
    if (index === -1) return;
    
    inventory[index] = {
        ...inventory[index],
        name: document.getElementById('editProductName').value.trim(),
        partNumber: document.getElementById('editProductSKU').value.trim().toUpperCase(),
        category: document.getElementById('editProductCategory').value,
        brand: document.getElementById('editProductBrand').value.trim(),
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        description: document.getElementById('editProductDescription').value.trim(),
        compatibility: document.getElementById('editProductCompatibility').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
    };
    
    // Check if new image was uploaded
    const imagePreview = document.getElementById('editImagePreview');
    if (imagePreview.src && !imagePreview.src.includes('data:image/svg+xml')) {
        inventory[index].image = imagePreview.src;
    }
    
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
// IMAGE UPLOAD
// ========================================
function setupImageUpload(uploadAreaId, fileInputId, previewId, contentId) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);
    const content = document.getElementById(contentId);
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--orange-accent)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });
    
    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            if (content) content.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// ========================================
// SEARCH & FILTER
// ========================================
function setupSearchAndFilter() {
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        
        let filtered = inventory;
        
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.partNumber.toLowerCase().includes(searchTerm) ||
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
    categoryFilter.addEventListener('change', filterProducts);
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
    // Initialize authentication first
    initAuth();
    
    // Load inventory and update UI
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
    setupImageUpload('imageUploadArea', 'productImage', 'imagePreview', 'imageUploadContent');
    setupImageUpload('editImageUploadArea', 'editProductImage', 'editImagePreview', null);
    
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
window.attemptLogin = attemptLogin;
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
