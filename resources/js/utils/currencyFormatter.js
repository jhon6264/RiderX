// C:\Users\User\Desktop\RiderX\resources\js\utils\currencyFormatter.js
export const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    
    // Check if price has decimals
    if (numericPrice % 1 === 0) {
        return `₱${numericPrice.toLocaleString()}`; // No decimals needed
    } else {
        return `₱${numericPrice.toLocaleString(undefined, { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        })}`; // Show decimals
    }
};

// Examples:
// formatPrice(1200) → "₱1,200"
// formatPrice(1199.50) → "₱1,199.50" 
// formatPrice(899.99) → "₱899.99"
// formatPrice(1500.00) → "₱1,500"