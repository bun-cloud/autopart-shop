/**
 * druzroadstar shop - Admin Inventory Management
 * Features: Product CRUD, image upload, Supabase Authentication
 */

// ========================================
// GLOBAL VARIABLES FOR MULTIPLE IMAGES
// ========================================

let uploadedImages = []; // For add product form
let editUploadedImages = []; // For edit product form

// ========================================
// HIBP PASSWORD PROTECTION (HaveIBeenPwned)
// ========================================

/**
 * Check if a password has been leaked using HaveIBeenPwned API
 * Uses k-anonymity - only sends first 5 chars of SHA-1 hash
 * @param {string} password - The password to check
 * @returns {Promise<{leaked: boolean, count: number}>}
 */
async function checkPasswordBreach(password) {
    if (!password || password.length === 0) {
        return { leaked: false, count: 0 };
    }

    try {
        // SHA-1 hash the password
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

        // Get first 5 characters (prefix) for k-anonymity
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);

        // Query HIBP API with just the prefix
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: {
                'Add-Padding': 'true' // Helps prevent timing attacks
            }
        });

        if (!response.ok) {
            console.error('HIBP API error:', response.status);
            return { leaked: false, count: 0, error: true };
        }

        const text = await response.text();
        const lines = text.split('\n');

        // Check if our hash suffix appears in results
        for (const line of lines) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix.trim() === suffix) {
                return { leaked: true, count: parseInt(count.trim(), 10) };
            }
        }

        return { leaked: false, count: 0 };
    } catch (error) {
        console.error('Error checking password breach:', error);
        return { leaked: false, count: 0, error: true };
    }
}

/**
 * Add password protection UI to a password input field
 * @param {string} inputId - The ID of the password input
 * @param {string} feedbackId - The ID of the feedback element
 * @param {Object} options - Configuration options
 */
function setupPasswordProtection(inputId, feedbackId, options = {}) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);

    if (!input || !feedback) {
        console.warn(`Password protection elements not found: ${inputId}, ${feedbackId}`);
        return;
    }

    const defaultOptions = {
        minLength: 8,
        showStrength: true,
        checkBreach: true,
        debounceMs: 500
    };

    const opts = { ...defaultOptions, ...options };

    let debounceTimer;

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);

        const password = input.value;

        // Clear previous feedback
        feedback.innerHTML = '';
        feedback.className = 'password-feedback';

        if (password.length === 0) {
            feedback.style.display = 'none';
            input.classList.remove('weak', 'fair', 'good', 'strong');
            return;
        }

        feedback.style.display = 'block';

        // Check minimum length
        if (password.length < opts.minLength) {
            feedback.innerHTML = `<span class="feedback-warning">⚠️ Password should be at least ${opts.minLength} characters</span>`;
            feedback.classList.add('weak');
            if (opts.showStrength) input.classList.add('weak');
            return;
        }

        // Calculate password strength
        const strength = calculatePasswordStrength(password);
        let strengthHtml = '';

        if (opts.showStrength) {
            const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
            const strengthColors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#2ecc71'];
            strengthHtml = `<div class="strength-bar"><div class="strength-fill" style="width:${strength * 20}%; background:${strengthColors[strength - 1]}"></div></div>
                           <span class="strength-label" style="color:${strengthColors[strength - 1]}">${strengthLabels[strength - 1]}</span>`;
        }

        // Check for breach if enabled
        if (opts.checkBreach && password.length >= opts.minLength) {
            feedback.innerHTML = `<div class="checking-password">🔍 Checking password security...</div>`;

            debounceTimer = setTimeout(async () => {
                const breachResult = await checkPasswordBreach(password);

                if (breachResult.error) {
                    // HIBP API failed, still show strength
                    feedback.innerHTML = `${strengthHtml}<div class="feedback-warning">⚠️ Could not verify password security. Please choose a strong password.</div>`;
                } else if (breachResult.leaked) {
                    // Password is compromised!
                    const count = breachResult.count.toLocaleString();
                    feedback.innerHTML = `${strengthHtml}
                        <div class="feedback-danger">
                            🚨 <strong>COMPROMISED PASSWORD!</strong><br>
                            This password has been found in <strong>${count}</strong> data breaches.<br>
                            <em>Hackers may already know this password.</em><br>
                            <strong>Please choose a different password.</strong>
                        </div>`;
                    feedback.classList.add('critical');
                    input.classList.remove('weak', 'fair', 'good', 'strong');
                    input.classList.add('compromised');
                } else {
                    // Password is safe
                    feedback.innerHTML = `${strengthHtml}
                        <div class="feedback-success">✓ This password has not been found in known data breaches</div>`;
                    feedback.classList.add('strong');
                    if (opts.showStrength) {
                        input.classList.remove('weak', 'fair', 'good');
                        input.classList.add('strong');
                    }
                }
            }, opts.debounceMs);
        } else {
            feedback.innerHTML = strengthHtml;
            feedback.classList.add(strength >= 4 ? 'good' : strength >= 3 ? 'fair' : 'weak');
            if (opts.showStrength) {
                input.classList.remove('weak', 'fair', 'good', 'strong');
                input.classList.add(strength >= 4 ? 'strong' : strength >= 3 ? 'good' : strength >= 2 ? 'fair' : 'weak');
            }
        }
    });
}

/**
 * Calculate password strength (0-5)
 * @param {string} password
 * @returns {number}
 */
function calculatePasswordStrength(password) {
    let score = 0;

    // Length checks
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Penalties
    if (/^[a-zA-Z]+$/.test(password)) score -= 1; // Only letters
    if (/^[0-9]+$/.test(password)) score -= 1; // Only numbers
    if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters

    // Return score between 1 and 5
    return Math.max(1, Math.min(5, Math.floor(score / 2)));
}

/**
 * Validate that a password is secure before submission
 * @param {string} password
 * @returns {{valid: boolean, message: string}}
 */
function validatePassword(password) {
    if (!password || password.length === 0) {
        return { valid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }

    return { valid: true, message: 'Password is valid' };
}

// ========================================
// SUPABASE AUTHENTICATION (Direct API - No library needed)
// ========================================

// Initialize authentication on page load
function initAuth() {
    console.log('Initializing Authentication...');

    // Check for existing session
    checkLoginStatus();

    // Handle Enter key on login form
    const emailField = document.getElementById('adminEmail');
    const passwordField = document.getElementById('adminPassword');

    if (emailField) {
        emailField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (passwordField) passwordField.focus();
            }
        });
    }

    if (passwordField) {
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                attemptLogin();
            }
        });
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('User signed in');
            showAdminPanel();
            showToast('Welcome back!');
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            showLoginScreen();
        }
    });
}

// Attempt to login
async function attemptLogin() {
    const emailField = document.getElementById('adminEmail');
    const passwordField = document.getElementById('adminPassword');
    
    if (!emailField || !passwordField) {
        showLoginError('Login form not found');
        return;
    }
    
    const email = emailField.value.trim();
    const password = passwordField.value;
    
    if (!email || !password) {
        showLoginError('Please enter both email and password');
        return;
    }
    
    // Disable login button during attempt
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    if (loginBtn) loginBtn.disabled = true;
    if (loginBtnText) loginBtnText.textContent = 'Signing in...';
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            showLoginError(error.message);
            console.log('Login failed:', error.message);
        } else {
            console.log('Login successful for:', email);
            showAdminPanel();
            showToast('Welcome back!');
        }
    } catch (err) {
        showLoginError('An unexpected error occurred');
        console.error('Login error:', err);
    } finally {
        if (loginBtn) loginBtn.disabled = false;
        if (loginBtnText) loginBtnText.textContent = 'Access Admin Panel';
    }
}

// Check if user is already logged in
async function checkLoginStatus() {
    try {
        console.log('Checking login status...');
        const result = await supabase.auth.getSession();
        console.log('Session result:', result);
        
        if (result.data && result.data.session) {
            console.log('Found existing session, showing admin panel');
            showAdminPanel();
        } else {
            console.log('No session found, showing login screen');
            showLoginScreen();
        }
    } catch (err) {
        console.error('Error checking session:', err);
        showLoginScreen();
    }
}

// Logout function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            showToast('Error signing out: ' + error.message);
        } else {
            // onAuthStateChange will handle showing login screen
            showToast('You have been logged out');
        }
    } catch (err) {
        console.error('Logout error:', err);
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
    
    // Clear form fields
    const emailField = document.getElementById('adminEmail');
    const passwordField = document.getElementById('adminPassword');
    
    if (emailField) {
        emailField.value = '';
        emailField.focus();
    }
    if (passwordField) {
        passwordField.value = '';
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
        if (message && message !== 'Please enter both email and password') {
            loginSubtitle.textContent = 'Access Denied';
        } else {
            loginSubtitle.textContent = 'Enter Email & Password';
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

// Migration function: Move localStorage data to Supabase
async function migrateLocalStorageToSupabase() {
    const stored = localStorage.getItem('inventory_db');
    if (!stored) return;
    
    try {
        // Check if Supabase already has data
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
        
        if (count === 0) {
            const localProducts = JSON.parse(stored);
            if (localProducts.length > 0) {
                console.log('Migrating localStorage data to Supabase...');
                
                // Format data for Supabase
                const formattedData = localProducts.map(p => ({
                    name: p.name,
                    category: p.category,
                    brand: p.brand,
                    price: parseFloat(p.price) || 0,
                    description: p.description || '',
                    sold: p.sold || false,
                    images: p.images || [p.image] || [],
                    // Let Supabase handle id and created_at
                }));
                
                const { error } = await supabase.from('products').insert(formattedData);
                if (error) {
                    console.error('Migration error:', error);
                    showToast('Migration failed: ' + error.message);
                } else {
                    console.log('Migration successful!');
                    showToast('Data migrated to cloud successfully!');
                }
            }
        }
    } catch (err) {
        console.error('Migration check failed:', err);
    }
}

async function loadInventory() {
    try {
        console.log('Loading inventory from Supabase...');
        
        // First, check for migration
        await migrateLocalStorageToSupabase();
        
        // Fetch from Supabase
        const result = await supabase.from('products').select('*');
        console.log('Products query result:', result);
        
        const { data: products, error } = result;
        
        if (error) {
            console.error('Error loading from Supabase:', error);
            // Fallback to localStorage if Supabase fails
            const stored = localStorage.getItem('inventory_db');
            if (stored) {
                inventory = JSON.parse(stored);
                showToast('Using local data (offline mode)');
            } else {
                inventory = [...defaultInventory];
            }
        } else {
            console.log('Loaded products:', products);
            inventory = products || [];
        }
        
        // Update UI
        updateDashboard();
        renderProductsTable();
        updateCategoryDatalists();
    } catch (err) {
        console.error('Unexpected error loading inventory:', err);
        inventory = [...defaultInventory];
    }
}

async function loadCategories() {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*');
        
        if (error) {
            console.error('Error loading categories:', error);
            // Fallback to localStorage
            const stored = localStorage.getItem('product_categories');
            return stored ? JSON.parse(stored) : [...defaultCategories];
        }
        
        // Return category names array
        return categories ? categories.map(c => c.name) : [...defaultCategories];
    } catch (err) {
        console.error('Unexpected error loading categories:', err);
        const stored = localStorage.getItem('product_categories');
        return stored ? JSON.parse(stored) : [...defaultCategories];
    }
}

async function saveCategories(categories) {
    try {
        // Delete all existing categories and re-insert
        const { error: deleteError } = await supabase.from('categories').delete();
        if (deleteError) {
            console.error('Error clearing categories:', deleteError);
        }
        
        // Insert new categories
        const formattedCategories = categories.map(name => ({
            name: name
        }));
        
        const { error: insertError } = await supabase.from('categories').insert(formattedCategories);
        if (insertError) {
            console.error('Error saving categories:', insertError);
            showToast('Error saving categories');
        }
        
        // Also save to localStorage as backup
        localStorage.setItem('product_categories', JSON.stringify(categories));
        updateCategoryDatalists();
    } catch (err) {
        console.error('Unexpected error saving categories:', err);
        // Save to localStorage as fallback
        localStorage.setItem('product_categories', JSON.stringify(categories));
    }
}

function resetDatabase() {
    // This will just clear localStorage since Supabase data is in cloud
    localStorage.removeItem('inventory_db');
    localStorage.removeItem('product_categories');
    inventory = [...defaultInventory];
    loadInventory();
    showToast('Database reset! Refreshing...');
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

async function getCategories() {
    return await loadCategories();
}

async function updateCategoryDatalists() {
    const categories = await getCategories();
    
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

async function openCategoryManager() {
    await renderCategoryList();
    document.getElementById('categoryManagerModal').classList.add('active');
}

function closeCategoryManager() {
    document.getElementById('categoryManagerModal').classList.remove('active');
    document.getElementById('newCategoryName').value = '';
}

async function renderCategoryList() {
    const categories = await getCategories();
    const container = document.getElementById('categoryListContainer');
    
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

async function addNewCategory() {
    const input = document.getElementById('newCategoryName');
    const name = input.value.trim();
    
    if (!name) {
        showToast('Please enter a category name');
        return;
    }
    
    const categories = await getCategories();
    
    if (categories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
        showToast('This category already exists');
        return;
    }
    
    // Add to Supabase
    const { error } = await supabase.from('categories').insert([{ name: name }]);
    
    if (error) {
        showToast('Error adding category: ' + error.message);
        return;
    }
    
    await saveCategories(categories);
    await renderCategoryList();
    input.value = '';
    showToast('Category added successfully!');
}

async function editCategory(index) {
    const categories = await getCategories();
    const currentName = categories[index];
    const newName = prompt('Edit category name:', currentName);
    
    if (newName && newName.trim() !== '' && newName.trim() !== currentName) {
        const trimmedName = newName.trim();
        
        if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
            showToast('This category name already exists');
            return;
        }
        
        // Update products with new category name
        for (const product of inventory) {
            if (product.category === currentName) {
                product.category = trimmedName;
                await supabase.from('products').update({ category: trimmedName }).eq('id', product.id);
            }
        }
        
        // Delete old category and insert new one in Supabase
        await supabase.from('categories').delete().eq('name', currentName);
        await supabase.from('categories').insert([{ name: trimmedName }]);
        
        await saveCategories(categories);
        await renderCategoryList();
        updateDashboard();
        renderProductsTable();
        showToast('Category updated successfully!');
    }
}

async function deleteCategory(index) {
    const categories = await getCategories();
    const categoryName = categories[index];
    
    // Check if any products use this category
    const productsWithCategory = inventory.filter(p => p.category === categoryName);
    if (productsWithCategory.length > 0) {
        const confirmDelete = confirm(`${productsWithCategory.length} product(s) are using this category. Are you sure you want to delete it?`);
        if (!confirmDelete) return;
    }
    
    // Delete from Supabase
    const { error } = await supabase.from('categories').delete().eq('name', categoryName);
    
    if (error) {
        showToast('Error deleting category: ' + error.message);
        return;
    }
    
    categories.splice(index, 1);
    await saveCategories(categories);
    await renderCategoryList();
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
    const totalValue = inventory.reduce((sum, p) => sum + (p.price || 0), 0);
    
    // Update stat cards
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    
    // Remove low stock stat card if it exists
    const lowStockCard = document.querySelector('.stat-card .stat-icon.total-value');
    if (lowStockCard && lowStockCard.parentElement.querySelector('.stat-label').textContent === 'Low Stock Items') {
        lowStockCard.parentElement.parentElement.remove();
    }
    
    // Render recent products (last 5)
    const recentProducts = [...inventory].slice(-5).reverse();
    const recentContainer = document.getElementById('recentProducts');
    recentContainer.innerHTML = recentProducts.map(product => `
        <div class="recent-item">
            <img src="${product.images?.[0] || product.image || generatePlaceholderImage('Product')}" alt="${product.name}" onerror="this.src='${generatePlaceholderImage('Product')}'">
            <div class="recent-item-info">
                <div class="recent-item-name">${product.name}</div>
                <div class="recent-item-meta">${product.category} | $${(product.price || 0).toFixed(2)}</div>
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
                <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
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
            <td>
                <div class="product-image-placeholder" style="width: 50px; height: 50px; background: #4a4a4a; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #f5f5f5;">
                    ${product.category ? product.category.substring(0, 3).toUpperCase() : 'IMG'}
                </div>
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.brand || '-'}</td>
            <td class="price">$${(product.price || 0).toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Edit">
                        <span class="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </span>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                        <span class="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </span>
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
// EXPORT TO CSV
// ========================================
function exportToCSV() {
    if (inventory.length === 0) {
        showToast('No products to export');
        return;
    }
    
    // Create CSV content
    const headers = ['Product Name', 'Brand', 'Price'];
    const rows = inventory.map(product => [
        `"${(product.name || '').replace(/"/g, '""')}"`,
        `"${(product.brand || '').replace(/"/g, '""')}"`,
        `"${(product.price || 0).toFixed(2)}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set filename with current date
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${date}.csv`);
    link.style.visibility = 'hidden';
    
    // Add to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exported ${inventory.length} products to CSV`);
}

// ========================================
// ADD PRODUCT
// ========================================
async function handleProductSubmit(e) {
    if (e) e.preventDefault();
    console.log('Add Product form submitted');

    // Validate required fields
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const brand = document.getElementById('productBrand').value.trim();
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value.trim();

    if (!name || !category || !brand || !price || !description) {
        showToast('Please fill in all required fields');
        return;
    }

    try {
        // Use uploaded images array or generate placeholder if empty
        const productImages = uploadedImages.length > 0 ? uploadedImages : [generatePlaceholderImage("Product")];

        const productData = {
            name: name,
            category: category,
            brand: brand,
            price: parseFloat(price),
            description: description,
            sold: false,
            images: productImages
        };

        console.log('Submitting product data:', JSON.stringify(productData, null, 2));

        // Insert to Supabase
        const result = await supabase.from('products').insert([productData]);

        if (result.error) {
            console.error('Supabase error:', result.error);
            showToast('Error adding product: ' + (result.error.message || 'Unknown error'));
            return;
        }

        console.log('Product added successfully:', result.data);
        showToast('Product added successfully!');
        resetForm();
        await loadInventory(); // Refresh from Supabase
        navigateTo('products'); // Go to products tab to see the new product
    } catch (err) {
        console.error('Error adding product:', err);
        showToast('Error adding product: ' + (err.message || 'Unknown error'));
    }
}

// Backup click handler for mobile devices
function handleProductSubmitClick() {
    console.log('Add Product button clicked directly');
    const form = document.getElementById('productForm');
    if (form) {
        handleProductSubmit({ preventDefault: () => {} });
    }
}

function resetForm() {
    document.getElementById('productForm').reset();
    
    // Clear uploaded images
    uploadedImages = [];
    document.getElementById('imageGallery').style.display = 'none';
    document.getElementById('imageGalleryGrid').innerHTML = '';
}

// ========================================
// EDIT PRODUCT
// ========================================
function editProduct(id) {
    // Find the product
    const product = inventory.find(p => p.id === id);
    if (!product) {
        alert('Product not found with ID: ' + id);
        return;
    }
    
    // Populate form fields with fallbacks for missing data
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name || '';
    document.getElementById('editProductCategory').value = product.category || '';
    document.getElementById('editProductBrand').value = product.brand || '';
    document.getElementById('editProductPrice').value = product.price || 0;
    document.getElementById('editProductDescription').value = product.description || '';
    document.getElementById('editProductSold').checked = product.sold || false;
    
    // Load product images into the edit gallery
    editUploadedImages = product.images || [];
    renderImageGallery('editUploadedImages', 'editImageGallery', 'editImageGalleryGrid');
    
    // Show the modal
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.classList.add('active');
    } else {
        alert('Error: Edit modal not found!');
    }
}

// Wrapper function for onclick handler
function editProductWrapper(id) {
    editProduct(id);
}

function closeEditModal() {
    document.getElementById('editProductModal').classList.remove('active');
}

async function handleEditSubmit(e) {
    e.preventDefault();
    console.log('Edit Product form submitted');
    
    try {
        const id = parseInt(document.getElementById('editProductId').value);
        console.log('Editing product ID:', id);
        
        // Get current product to preserve images if not changed
        const currentProduct = inventory.find(p => p.id === id);
        if (!currentProduct) {
            showToast('Error: Product not found');
            return;
        }
        
        // Use uploaded images if any, otherwise keep current images
        let images = currentProduct.images || [];
        if (editUploadedImages.length > 0) {
            images = editUploadedImages;
        }
        
        const updateData = {
            name: document.getElementById('editProductName').value.trim(),
            category: document.getElementById('editProductCategory').value,
            brand: document.getElementById('editProductBrand').value.trim(),
            price: parseFloat(document.getElementById('editProductPrice').value),
            description: document.getElementById('editProductDescription').value.trim(),
            sold: document.getElementById('editProductSold').checked,
            images: images
        };
        
        console.log('Updating product:', updateData);
        
        // Update in Supabase
        const { error } = await supabase.from('products').update(updateData).eq('id', id);
        
        if (error) {
            console.error('Supabase error:', error);
            showToast('Error updating product: ' + error.message);
            return;
        }
        
        console.log('Product updated successfully');
        showToast('Product updated successfully!');
        closeEditModal();
        loadInventory(); // Refresh from Supabase
    } catch (err) {
        console.error('Error updating product:', err);
        showToast('Error updating product: ' + err.message);
    }
}

// Backup click handler for mobile devices
function handleEditSubmitClick() {
    console.log('Save Changes button clicked directly');
    const form = document.getElementById('editProductForm');
    if (form) {
        handleEditSubmit({ preventDefault: () => {} });
    }
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

async function confirmDelete() {
    const deleteValue = document.getElementById('deleteProductId').value;
    
    // Check if it's bulk delete (comma-separated IDs)
    if (deleteValue.includes(',')) {
        const ids = deleteValue.split(',').map(id => parseInt(id.trim()));
        const count = ids.length;
        
        // Delete each from Supabase
        for (const id of ids) {
            await supabase.from('products').delete().eq('id', id);
        }
        
        showToast(`${count} products deleted successfully!`);
    } else {
        const id = parseInt(deleteValue);
        
        // Delete from Supabase
        const { error } = await supabase.from('products').delete().eq('id', id);
        
        if (error) {
            showToast('Error deleting product: ' + error.message);
            return;
        }
        
        showToast('Product deleted successfully!');
    }
    
    closeDeleteModal();
    loadInventory(); // Refresh from Supabase
}

// Make additional functions globally available
window.toggleSelectAll = toggleSelectAll;
window.toggleProductSelection = toggleProductSelection;
window.deleteSelectedProducts = deleteSelectedProducts;
window.exportToCSV = exportToCSV;
window.removeUploadedImage = removeUploadedImage;
window.setPrimaryImage = setPrimaryImage;
window.addMoreImages = addMoreImages;

// ========================================
// IMAGE UPLOAD - MULTIPLE IMAGES SUPPORT
// ========================================

// Setup image upload for a form
function setupImageUpload(uploadAreaId, fileInputId, galleryId, galleryGridId, imageArrayName) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);
    const gallery = document.getElementById(galleryId);
    const galleryGrid = document.getElementById(galleryGridId);
    
    // Make the entire upload area clickable
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
    }
    
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
        handleImageFiles(e.dataTransfer.files, imageArrayName, galleryId, galleryGridId);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleImageFiles(e.target.files, imageArrayName, galleryId, galleryGridId);
        // Reset input so same file can be selected again
        fileInput.value = '';
    });
}

// Handle multiple image files
function handleImageFiles(files, imageArrayName, galleryId, galleryGridId) {
    const maxImages = 20;
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const imageArray = imageArrayName === 'uploadedImages' ? uploadedImages : editUploadedImages;
    
    Array.from(files).forEach((file, index) => {
        // Check if we've reached the limit
        if (imageArray.length >= maxImages) {
            showToast(`Maximum ${maxImages} images allowed`);
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file');
            return;
        }
        
        // Validate file size
        if (file.size > maxSize) {
            showToast('Image size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            imageArray.push(imageData);
            renderImageGallery(imageArrayName, galleryId, galleryGridId);
        };
        reader.readAsDataURL(file);
    });
}

// Render the image gallery
function renderImageGallery(imageArrayName, galleryId, galleryGridId) {
    const imageArray = imageArrayName === 'uploadedImages' ? uploadedImages : editUploadedImages;
    const gallery = document.getElementById(galleryId);
    const galleryGrid = document.getElementById(galleryGridId);
    
    if (!gallery || !galleryGrid) return;
    
    if (imageArray.length === 0) {
        gallery.style.display = 'none';
        return;
    }
    
    gallery.style.display = 'block';
    galleryGrid.innerHTML = '';
    
    imageArray.forEach((imageData, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item' + (index === 0 ? ' primary' : '');
        item.innerHTML = `
            <img src="${imageData}" alt="Product image ${index + 1}">
            <button class="remove-btn" onclick="removeUploadedImage('${imageArrayName}', ${index}, '${galleryId}', '${galleryGridId}')">&times;</button>
            ${index !== 0 ? `<button class="set-primary-btn" onclick="setPrimaryImage('${imageArrayName}', ${index}, '${galleryId}', '${galleryGridId}')" title="Set as primary">★</button>` : ''}
        `;
        galleryGrid.appendChild(item);
    });
    
    // Add "add more" button if under limit
    if (imageArray.length < 20) {
        const addMore = document.createElement('div');
        addMore.className = 'gallery-add-more';
        addMore.onclick = () => {
            const fileInput = imageArrayName === 'uploadedImages' 
                ? document.getElementById('productImage')
                : document.getElementById('editProductImage');
            if (fileInput) fileInput.click();
        };
        addMore.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add more</span>
        `;
        galleryGrid.appendChild(addMore);
    }
}

// Remove an uploaded image
function removeUploadedImage(imageArrayName, index, galleryId, galleryGridId) {
    const imageArray = imageArrayName === 'uploadedImages' ? uploadedImages : editUploadedImages;
    if (index >= 0 && index < imageArray.length) {
        imageArray.splice(index, 1);
        renderImageGallery(imageArrayName, galleryId, galleryGridId);
    }
}

// Set an image as primary (move to front)
function setPrimaryImage(imageArrayName, index, galleryId, galleryGridId) {
    const imageArray = imageArrayName === 'uploadedImages' ? uploadedImages : editUploadedImages;
    if (index > 0 && index < imageArray.length) {
        const image = imageArray.splice(index, 1)[0];
        imageArray.unshift(image);
        renderImageGallery(imageArrayName, galleryId, galleryGridId);
    }
}

// Trigger file input for adding more images
function addMoreImages(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    if (fileInput) fileInput.click();
}

// ========================================
// SEARCH & FILTER
// ========================================
function setupSearchAndFilter() {
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        
        let filtered = inventory;
        
        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.name || '').toLowerCase().includes(searchTerm) ||
                (product.brand || '').toLowerCase().includes(searchTerm) ||
                (product.description || '').toLowerCase().includes(searchTerm)
            );
        }
        
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }
        
        renderProductsTable(filtered);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
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

    // Initialize password protection
    setupPasswordProtection('adminPassword', 'adminPasswordFeedback', {
        minLength: 8,
        showStrength: true,
        checkBreach: true,
        debounceMs: 800
    });

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

    // Add Product button - Mobile optimized
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add Product button clicked');
            handleProductSubmit({ preventDefault: () => {} });
        });
    }

    // Image upload - multiple images support
    setupImageUpload('imageUploadArea', 'productImage', 'imageGallery', 'imageGalleryGrid', 'uploadedImages');
    setupImageUpload('editImageUploadArea', 'editProductImage', 'editImageGallery', 'editImageGalleryGrid', 'editUploadedImages');

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
window.editProductWrapper = editProductWrapper;
window.deleteProduct = deleteProduct;
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.resetForm = resetForm;
window.resetDatabase = resetDatabase;
window.attemptLogin = attemptLogin;
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.handleProductSubmitClick = handleProductSubmitClick;
window.handleEditSubmitClick = handleEditSubmitClick;
