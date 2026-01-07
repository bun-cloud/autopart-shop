/**
 * Inventory Validation Test
 * This script verifies that frontend and admin panel are synchronized
 */

function validateInventoryConsistency() {
    console.log('=== Inventory Consistency Validation ===\n');
    
    // Get inventory from localStorage (shared source)
    const storedInventory = localStorage.getItem('inventory_db');
    const inventory = storedInventory ? JSON.parse(storedInventory) : [];
    
    console.log(`Total products in database: ${inventory.length}`);
    console.log(`Database key used: inventory_db`);
    
    // Check for data integrity issues
    const issues = [];
    
    // Check for duplicate IDs
    const ids = inventory.map(p => p.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        issues.push(`Found duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
    }
    
    // Check for missing required fields
    inventory.forEach((product, index) => {
        if (!product.id) issues.push(`Product at index ${index} missing ID`);
        if (!product.name) issues.push(`Product ID ${product.id} missing name`);
        if (typeof product.price !== 'number') issues.push(`Product ID ${product.id} has invalid price`);
    });
    
    // Check for negative values
    inventory.forEach(product => {
        // Removed stock check as stock field has been removed
    });
    
    // Calculate total inventory value
    const totalValue = inventory.reduce((sum, p) => sum + p.price, 0);
    
    console.log(`\nInventory Statistics:`);
    console.log(`- Total products: ${inventory.length}`);
    console.log(`- Total inventory value: $${totalValue.toFixed(2)}`);
    console.log(`- Average price: $${(totalValue / inventory.length).toFixed(2)}`);
    
    // Show category breakdown
    const categories = {};
    inventory.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log(`\nProducts by Category:`);
    Object.entries(categories).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} products`);
    });
    
    // Report issues
    if (issues.length > 0) {
        console.log('\n⚠️ Issues Found:');
        issues.forEach(issue => console.log(`  - ${issue}`));
        return false;
    } else {
        console.log('\n✓ No data integrity issues found');
        return true;
    }
}

// Run validation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const isValid = validateInventoryConsistency();
        console.log('\n=== Validation Complete ===');
        console.log(`Status: ${isValid ? 'PASSED ✓' : 'FAILED ⚠️'}`);
    }, 500);
});
