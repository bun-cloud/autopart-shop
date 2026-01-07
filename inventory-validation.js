/**
 * Inventory Validation Test
 * This script verifies that the storefront correctly loads products
 * from the products/ folder (Client-Side Aggregation)
 */

let validationResults = {
    totalProducts: 0,
    loadedProducts: 0,
    errors: [],
    warnings: []
};

async function validateInventoryConsistency() {
    console.log('=== Inventory Consistency Validation ===\n');
    
    // Reset results
    validationResults = {
        totalProducts: 25, // Expected total from PRODUCT_FILES mapping
        loadedProducts: 0,
        errors: [],
        warnings: []
    };
    
    // Load products using the same method as the main app
    const products = await loadAllProducts();
    
    validationResults.loadedProducts = products.length;
    
    console.log(`Expected products: ${validationResults.totalProducts}`);
    console.log(`Loaded products: ${products.length}`);
    console.log(`Data source: products/ folder (Client-Side Aggregation)\n`);
    
    // Check for missing products
    if (products.length < validationResults.totalProducts) {
        const missing = validationResults.totalProducts - products.length;
        validationResults.warnings.push(`Missing ${missing} product(s)`);
    }
    
    if (products.length > validationResults.totalProducts) {
        validationResults.warnings.push(`Found ${products.length - validationResults.totalProducts} extra product(s)`);
    }
    
    // Check for data integrity issues
    const issues = [];
    
    // Check for duplicate IDs
    const ids = products.map(p => p.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        issues.push(`Found duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
    }
    
    // Check for missing required fields
    products.forEach((product, index) => {
        if (!product.id) issues.push(`Product at index ${index} missing ID`);
        if (!product.name) issues.push(`Product ID ${product.id || 'unknown'} missing name`);
        if (typeof product.price !== 'number') issues.push(`Product ID ${product.id || 'unknown'} has invalid price`);
        if (!product.category) issues.push(`Product ID ${product.id || 'unknown'} missing category`);
        if (!product.brand) issues.push(`Product ID ${product.id || 'unknown'} missing brand`);
        if (!product.description) issues.push(`Product ID ${product.id || 'unknown'} missing description`);
    });
    
    // Check for negative prices
    products.forEach(product => {
        if (product.price < 0) {
            issues.push(`Product ID ${product.id} has negative price: $${product.price}`);
        }
    });
    
    // Calculate total inventory value
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    
    console.log(`\nInventory Statistics:`);
    console.log(`- Total products: ${products.length}`);
    console.log(`- Total inventory value: $${totalValue.toFixed(2)}`);
    if (products.length > 0) {
        console.log(`- Average price: $${(totalValue / products.length).toFixed(2)}`);
    }
    
    // Show category breakdown
    const categories = {};
    products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log(`\nProducts by Category:`);
    Object.entries(categories).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} products`);
    });
    
    // Report issues
    if (issues.length > 0) {
        console.log('\n⚠️ Issues Found:');
        issues.forEach(issue => {
            console.log(`  - ${issue}`);
            validationResults.errors.push(issue);
        });
    } else {
        console.log('\n✓ No data integrity issues found');
    }
    
    // Report warnings
    if (validationResults.warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        validationResults.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    const isValid = issues.length === 0;
    console.log(`\n=== Validation Complete ===`);
    console.log(`Status: ${isValid ? 'PASSED ✓' : 'FAILED ⚠️'}`);
    
    return {
        success: isValid,
        products: products,
        results: validationResults
    };
}

// Make loadAllProducts available for validation
async function loadAllProducts() {
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

// Run validation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        const result = await validateInventoryConsistency();
        
        // Update results display if element exists
        const resultsContainer = document.getElementById('validationResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="padding: 1rem; background: ${result.success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'}; border-radius: 8px; margin-top: 1rem;">
                    <strong style="color: ${result.success ? '#4caf50' : '#f44364'}">
                        ${result.success ? '✓ Validation Passed' : '⚠️ Validation Failed'}
                    </strong>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #c0c0c0;">
                        Loaded ${result.results.loadedProducts} of ${result.results.totalProducts} expected products
                    </p>
                </div>
            `;
        }
    }, 1000);
});
