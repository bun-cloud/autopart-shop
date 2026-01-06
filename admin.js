/**
 * druzroadstar shop - Admin Inventory Management
 * Features: Product CRUD, image upload, stock management
 */

// ========================================
// PASSWORD PROTECTION
// ========================================
const ADMIN_PASSWORD = "L0ver262!!GI"; // Change this password to whatever you want

// Check if admin is logged in
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        // User is logged in, show admin panel
        showAdminPanel();
    } else {
        // User is not logged in, show login overlay
        showLoginScreen();
    }
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

// Handle login form submission
function initLoginHandler() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const passwordInput = document.getElementById('adminPassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredPassword = passwordInput.value;
            
            // Simple password check (in production, use server-side validation)
            if (enteredPassword === ADMIN_PASSWORD) {
                // Password correct
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
                passwordInput.value = ''; // Clear password field
                loginError.style.display = 'none';
            } else {
                // Password incorrect
                loginError.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    showLoginScreen();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initLoginHandler();
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
        partNumber: "BRK-CER-001",
        price: 45.99,
        brand: "Brembo",
        stock: 48,
        images: [generatePlaceholderImage("Brake Pads")],
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
        images: [generatePlaceholderImage("Brake Disc")],
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
        images: [generatePlaceholderImage("Caliper")],
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
        images: [generatePlaceholderImage("Oil Filter")],
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
        images: [generatePlaceholderImage("Cabin Filter")],
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
        images: [generatePlaceholderImage("Air Filter")],
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
        images: [generatePlaceholderImage("Spark Plugs")],
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
        images: [generatePlaceholderImage("Timing Belt")],
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
        images: [generatePlaceholderImage("Oil Pump")],
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
        images: [generatePlaceholderImage("Battery")],
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
        images: [generatePlaceholderImage("Alternator")],
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
        images: [generatePlaceholderImage("LED Lights")],
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
        images: [generatePlaceholderImage("Headlight")],
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
        images: [generatePlaceholderImage("Tail Light")],
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
        images: [generatePlaceholderImage("Fog Light")],
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
        images: [generatePlaceholderImage("Strut")],
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
        images: [generatePlaceholderImage("Sway Link")],
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
        images: [generatePlaceholderImage("Shocks")],
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
        images: [generatePlaceholderImage("Brake Kit")],
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
        images: [generatePlaceholderImage("Fuel Filter")],
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
        images: [generatePlaceholderImage("Ignition Coil")],
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
        images: [generatePlaceholderImage("Power Pump")],
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
        images: [generatePlaceholderImage("Starter")],
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
        images: [generatePlaceholderImage("Control Arm")],
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
        images: [generatePlaceholderImage("Hub Assembly")],
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
    const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
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
            <td><img src="${product.images[0]}" alt="${product.name}"></td>
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
        sold: document.getElementById('productSold').checked,
        description: document.getElementById('productDescription').value.trim(),
        compatibility: document.getElementById('productCompatibility').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0),
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
    document.getElementById('editProductSKU').value = product.partNumber;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductBrand').value = product.brand;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductSold').checked = product.sold || false;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductCompatibility').value = product.compatibility.join('\n');
    
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
        partNumber: document.getElementById('editProductSKU').value.trim().toUpperCase(),
        category: document.getElementById('editProductCategory').value,
        brand: document.getElementById('editProductBrand').value.trim(),
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        sold: document.getElementById('editProductSold').checked,
        description: document.getElementById('editProductDescription').value.trim(),
        compatibility: document.getElementById('editProductCompatibility').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0),
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
