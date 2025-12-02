import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeFormTab, setActiveFormTab] = useState('basic');
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        deletedProducts: 0,
        totalVariants: 0
    });

    // Enhanced stats with percentages and health indicators
    const [enhancedStats, setEnhancedStats] = useState({
        healthScore: 0,
        variantDensity: 0,
        archiveRate: 0,
        activePercentage: 0,
        archivedPercentage: 0
    });

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        base_price: '',
        description: '',
        category_id: '',
        specifications: [{ key: '', value: '' }],
        variants: [{
            color: '',
            hex_code: '#000000',
            image_url: '',
            price: '',
            stock_quantity: '',
            sku: '',
            manuallyEdited: false
        }]
    });
    const [formErrors, setFormErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);

    // Filter state for clickable stats
    const [activeStatFilter, setActiveStatFilter] = useState(null);

    // Fetch products and stats - FIXED with better error handling
    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: page,
                search: searchTerm,
                category: categoryFilter,
                ...(statusFilter === 'trashed' && { only_trashed: true }),
                ...(statusFilter === 'all' && { with_trashed: true })
            });

            const response = await fetch(`/admin/products?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // If we got HTML, we're probably not logged in or session expired
                if (response.status === 401 || response.status === 403) {
                    // Redirect to admin login
                    window.location.href = '/admin/login';
                    return;
                }
                throw new Error('Server returned HTML instead of JSON. Check authentication.');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Ensure products have variants array
                const productsWithVariants = data.data.data.map(product => ({
                    ...product,
                    variants: product.variants || [],
                    category: product.category || { display_name: 'Uncategorized' }
                }));
                
                setProducts(productsWithVariants);
                setCurrentPage(data.data.current_page);
                setTotalPages(data.data.last_page);
                updateStats(productsWithVariants);
            } else {
                setError('Failed to load products: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            setError('Error fetching products: ' + err.message);
            console.error('Fetch products error:', err);
            
            // If it's an auth error, redirect to login
            if (err.message.includes('authentication') || err.message.includes('401') || err.message.includes('403')) {
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    // Update real-time stats and calculate enhanced stats
    const updateStats = (productsData) => {
        const activeProducts = productsData.filter(p => !p.deleted_at).length;
        const deletedProducts = productsData.filter(p => p.deleted_at).length;
        const totalVariants = productsData.reduce((total, product) => total + (product.variants?.length || 0), 0);
        const totalProducts = productsData.length;
        
        // Calculate percentages and enhanced metrics
        const activePercentage = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0;
        const archivedPercentage = totalProducts > 0 ? Math.round((deletedProducts / totalProducts) * 100) : 0;
        const variantDensity = totalProducts > 0 ? (totalVariants / totalProducts).toFixed(1) : 0;
        
        setStats({
            totalProducts: totalProducts,
            activeProducts,
            deletedProducts,
            totalVariants
        });
        
        // Set enhanced stats
        setEnhancedStats({
            healthScore: activePercentage,
            variantDensity: parseFloat(variantDensity),
            archiveRate: archivedPercentage,
            activePercentage,
            archivedPercentage
        });
    };

    // Handle stat card clicks to filter table
    const handleStatClick = (filterType) => {
        setActiveStatFilter(filterType);
        
        switch(filterType) {
            case 'total':
                setStatusFilter('all');
                setSearchTerm('');
                setCategoryFilter('');
                break;
            case 'active':
                setStatusFilter('active');
                setSearchTerm('');
                setCategoryFilter('');
                break;
            case 'archived':
                setStatusFilter('trashed');
                setSearchTerm('');
                setCategoryFilter('');
                break;
            case 'variants':
                // Sort by number of variants (would need backend support)
                setStatusFilter('all');
                setSearchTerm('');
                setCategoryFilter('');
                break;
            default:
                setStatusFilter('active');
                setSearchTerm('');
                setCategoryFilter('');
        }
    };

    // Fetch categories for dropdown
    const fetchCategories = async () => {
        try {
            const response = await fetch('/admin/products/categories', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned HTML for categories');
            }
            
            const data = await response.json();
            if (data.success) {
                setCategories(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [searchTerm, categoryFilter, statusFilter]);

    // Reset stat filter when manually changing other filters
    useEffect(() => {
        setActiveStatFilter(null);
    }, [searchTerm, categoryFilter]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showCreateModal || showEditModal || showDeleteModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showCreateModal, showEditModal, showDeleteModal]);

    // Sync base price with variant prices
    const syncVariantPrices = (basePrice, currentVariants) => {
        return currentVariants.map(variant => ({
            ...variant,
            price: variant.manuallyEdited ? variant.price : basePrice
        }));
    };

    // Handle base price change with sync
    const handleBasePriceChange = (value) => {
        setFormData(prev => ({
            ...prev,
            base_price: value,
            variants: syncVariantPrices(value, prev.variants)
        }));
        
        if (formErrors.base_price) {
            setFormErrors(prev => ({
                ...prev,
                base_price: ''
            }));
        }
    };

    // Handle variant price change with manual edit tracking
    const handleVariantPriceChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, i) => 
                i === index ? { 
                    ...variant, 
                    price: value,
                    manuallyEdited: value !== prev.base_price
                } : variant
            )
        }));
    };

    // Delete product
    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                fetchProducts(currentPage);
                setShowDeleteModal(false);
                setProductToDelete(null);
            } else {
                setError('Failed to delete product: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            setError('Error deleting product: ' + err.message);
        }
    };

    // Restore product
    const handleRestore = async (productId) => {
        try {
            const response = await fetch(`/admin/products/${productId}/restore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                fetchProducts(currentPage);
            } else {
                setError('Failed to restore product: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            setError('Error restoring product: ' + err.message);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            base_price: '',
            description: '',
            category_id: '',
            specifications: [{ key: '', value: '' }],
            variants: [{
                color: '',
                hex_code: '#000000',
                image_url: '',
                price: '',
                stock_quantity: '',
                sku: '',
                manuallyEdited: false
            }]
        });
        setFormErrors({});
        setActiveFormTab('basic');
    };

    // Open create modal
    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    // Open edit modal - FIXED: Handle products with no variants
    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            brand: product.brand,
            base_price: product.base_price,
            description: product.description,
            category_id: product.category_id,
            specifications: product.specifications ? Object.entries(product.specifications).map(([key, value]) => ({
                key,
                value
            })) : [{ key: '', value: '' }],
            variants: (product.variants && product.variants.length > 0) ? product.variants.map(variant => ({
                ...variant,
                id: variant.id,
                price: variant.price ? variant.price.toString() : '',
                stock_quantity: variant.stock_quantity ? variant.stock_quantity.toString() : '',
                manuallyEdited: false
            })) : [{
                color: '',
                hex_code: '#000000',
                image_url: '',
                price: product.base_price ? product.base_price.toString() : '',
                stock_quantity: '',
                sku: '',
                manuallyEdited: false
            }]
        });
        setActiveFormTab('basic');
        setShowEditModal(true);
    };

    // Handle form input changes
    const handleInputChange = (field, value) => {
        if (field === 'base_price') {
            handleBasePriceChange(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
            
            if (formErrors[field]) {
                setFormErrors(prev => ({
                    ...prev,
                    [field]: ''
                }));
            }
        }
    };

    // Handle variant changes
    const handleVariantChange = (index, field, value) => {
        if (field === 'price') {
            handleVariantPriceChange(index, value);
        } else {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.map((variant, i) => 
                    i === index ? { ...variant, [field]: value } : variant
                )
            }));
        }
    };

    // Add new variant
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    color: '',
                    hex_code: '#000000',
                    image_url: '',
                    price: prev.base_price || '',
                    stock_quantity: '',
                    sku: '',
                    manuallyEdited: false
                }
            ]
        }));
    };

    // Remove variant
    const removeVariant = (index) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter((_, i) => i !== index)
            }));
        }
    };

    // Handle specification changes
    const handleSpecChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.map((spec, i) => 
                i === index ? { ...spec, [field]: value } : spec
            )
        }));
    };

    // Add specification
    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { key: '', value: '' }]
        }));
    };

    // Remove specification
    const removeSpecification = (index) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Product name is required';
        if (!formData.brand.trim()) errors.brand = 'Brand is required';
        if (!formData.base_price || parseFloat(formData.base_price) <= 0) errors.base_price = 'Valid base price is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.category_id) errors.category_id = 'Category is required';

        // Validate variants
        formData.variants.forEach((variant, index) => {
            if (!variant.color.trim()) errors[`variant_${index}_color`] = 'Color is required';
            if (!variant.price || parseFloat(variant.price) <= 0) errors[`variant_${index}_price`] = 'Valid price is required';
            if (!variant.stock_quantity || parseInt(variant.stock_quantity) < 0) errors[`variant_${index}_stock`] = 'Valid stock quantity is required';
            if (!variant.sku.trim()) errors[`variant_${index}_sku`] = 'SKU is required';
            
            // Validate image URL
            if (variant.image_url && !variant.image_url.startsWith('/') && !variant.image_url.startsWith('http') && !variant.image_url.startsWith('data:')) {
                errors[`variant_${index}_image`] = 'Image URL must be a valid path starting with / or http';
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit form (create or update)
    const submitForm = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setFormLoading(true);

        try {
            const url = showEditModal 
                ? `/admin/products/${editingProduct.id}`
                : '/admin/products';
            
            const method = showEditModal ? 'PUT' : 'POST';

            // Prepare specifications as object
            const specificationsObj = {};
            formData.specifications.forEach(spec => {
                if (spec.key.trim() && spec.value.trim()) {
                    specificationsObj[spec.key] = spec.value;
                }
            });

            // Remove manuallyEdited field before sending to backend
            const payload = {
                ...formData,
                specifications: specificationsObj,
                base_price: parseFloat(formData.base_price),
                variants: formData.variants.map(variant => {
                    const { manuallyEdited, ...variantData } = variant;
                    return {
                        ...variantData,
                        price: parseFloat(variant.price),
                        stock_quantity: parseInt(variant.stock_quantity),
                        ...(variant.id && { id: variant.id })
                    };
                })
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                fetchProducts(currentPage);
                setShowCreateModal(false);
                setShowEditModal(false);
                resetForm();
            } else {
                setError(data.message || 'Failed to save product');
            }
        } catch (err) {
            setError('Error saving product: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    // Get status badge
    const getStatusBadge = (product) => {
        if (product.deleted_at) {
            return <span className="status-badge status-deleted">Archived</span>;
        }
        return <span className="status-badge status-active">Active</span>;
    };

    // FIXED: Enhanced image handler with null checks
    const getProductImage = (product) => {
        // Get first variant or use empty object
        const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : {};
        
        if (!firstVariant.image_url) {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjhGOUZBIi8+Cjx0ZXh0IHg9IjI1IiB5PSIyOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2NjY2Ij5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K';
        }
        
        let imagePath = firstVariant.image_url;
        if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
            imagePath = '/' + imagePath;
        }
        
        return imagePath;
    };

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts(1);
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [searchTerm, categoryFilter, statusFilter]);

    // Get health indicator for variant density
    const getVariantDensityHealth = () => {
        if (enhancedStats.variantDensity >= 3 && enhancedStats.variantDensity <= 5) {
            return 'good';
        } else if (enhancedStats.variantDensity >= 2 && enhancedStats.variantDensity < 3) {
            return 'average';
        } else {
            return 'poor';
        }
    };

    // Get health indicator for archive rate
    const getArchiveRateHealth = () => {
        if (enhancedStats.archiveRate <= 10) {
            return 'good';
        } else if (enhancedStats.archiveRate <= 20) {
            return 'average';
        } else {
            return 'poor';
        }
    };

    return (
        <div className="admin-products">
            {/* Modern Header */}
            <div className="modern-header">
                <div className="header-content">
                    <h1>Product Management</h1>
                    <p>Manage your product catalog and inventory</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-modern-primary"
                        onClick={openCreateModal}
                    >
                        <span className="btn-icon">+</span>
                        Add Product
                    </button>
                </div>
            </div>

            {/* ENHANCED Modern Stats Grid */}
            <div className="enhanced-stats-grid">
                {/* Total Products Card */}
                <div 
                    className={`stat-card-enhanced total ${activeStatFilter === 'total' ? 'active' : ''}`}
                    onClick={() => handleStatClick('total')}
                    title="Click to show all products"
                >
                    <div className="stat-header">
                        <div className="stat-title">Total Products</div>
                        <div className="stat-indicator neutral"></div>
                    </div>
                    <div className="stat-number">{stats.totalProducts}</div>
                    <div className="stat-tooltip">All products in catalog</div>
                </div>

                {/* Active Products Card */}
                <div 
                    className={`stat-card-enhanced active ${activeStatFilter === 'active' ? 'active' : ''}`}
                    onClick={() => handleStatClick('active')}
                    title="Click to show active products only"
                >
                    <div className="stat-header">
                        <div className="stat-title">Active</div>
                        <div className={`health-indicator ${enhancedStats.healthScore >= 80 ? 'good' : enhancedStats.healthScore >= 60 ? 'average' : 'poor'}`}>
                            {enhancedStats.healthScore}%
                        </div>
                    </div>
                    <div className="stat-number">{stats.activeProducts}</div>
                    <div className="progress-container">
                        <div 
                            className="progress-bar active"
                            style={{ width: `${enhancedStats.activePercentage}%` }}
                        >
                            <span className="progress-text">{enhancedStats.activePercentage}%</span>
                        </div>
                    </div>
                    <div className="stat-tooltip">Products currently available for sale</div>
                </div>

                {/* Archived Products Card */}
                <div 
                    className={`stat-card-enhanced archived ${activeStatFilter === 'archived' ? 'active' : ''}`}
                    onClick={() => handleStatClick('archived')}
                    title="Click to show archived products only"
                >
                    <div className="stat-header">
                        <div className="stat-title">Archived</div>
                        <div className={`health-indicator ${getArchiveRateHealth()}`}>
                            {enhancedStats.archiveRate}%
                        </div>
                    </div>
                    <div className="stat-number">{stats.deletedProducts}</div>
                    <div className="progress-container">
                        <div 
                            className="progress-bar archived"
                            style={{ width: `${enhancedStats.archivedPercentage}%` }}
                        >
                            <span className="progress-text">{enhancedStats.archivedPercentage}%</span>
                        </div>
                    </div>
                    <div className="stat-tooltip">Products moved to archive</div>
                </div>

                {/* Variants Card */}
                <div 
                    className={`stat-card-enhanced variants ${activeStatFilter === 'variants' ? 'active' : ''}`}
                    onClick={() => handleStatClick('variants')}
                    title="Click to sort by number of variants"
                >
                    <div className="stat-header">
                        <div className="stat-title">Variants</div>
                        <div className={`health-indicator ${getVariantDensityHealth()}`}>
                            {enhancedStats.variantDensity}
                        </div>
                    </div>
                    <div className="stat-number">{stats.totalVariants}</div>
                    <div className="variant-density">
                        Average: {enhancedStats.variantDensity} per product
                    </div>
                    <div className="stat-tooltip">Total color/size variations</div>
                </div>
            </div>

            {/* NEW: Stats Insights Bar */}
            <div className="stats-insights">
                <div className="insight-item">
                    <span className="insight-label">Catalog Health:</span>
                    <span className={`insight-value ${enhancedStats.healthScore >= 80 ? 'good' : enhancedStats.healthScore >= 60 ? 'average' : 'poor'}`}>
                        {enhancedStats.healthScore >= 80 ? 'Good' : enhancedStats.healthScore >= 60 ? 'Average' : 'Needs Attention'}
                    </span>
                </div>
                <div className="insight-item">
                    <span className="insight-label">Variant Density:</span>
                    <span className={`insight-value ${getVariantDensityHealth()}`}>
                        {getVariantDensityHealth() === 'good' ? 'Optimal' : getVariantDensityHealth() === 'average' ? 'Average' : 'Low'}
                        {enhancedStats.variantDensity > 0 && ` (${enhancedStats.variantDensity}/product)`}
                    </span>
                </div>
                <div className="insight-item">
                    <span className="insight-label">Archive Rate:</span>
                    <span className={`insight-value ${getArchiveRateHealth()}`}>
                        {getArchiveRateHealth() === 'good' ? 'Healthy' : getArchiveRateHealth() === 'average' ? 'Acceptable' : 'High'}
                    </span>
                </div>
            </div>

            {/* Modern Table Controls */}
            <div className="modern-controls">
                <div className="controls-left">
                    <div className="search-modern">
                        <div className="search-icon">🔍</div>
                        <input
                            type="text"
                            className="search-input-modern"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="controls-right">
                    <select 
                        className="filter-modern"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>
                                {category.display_name}
                            </option>
                        ))}
                    </select>
                    <select 
                        className="filter-modern"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="trashed">Archived</option>
                        <option value="all">All Status</option>
                    </select>
                    <div className="results-modern">
                        {products.length} products
                    </div>
                </div>
            </div>

            {/* Modern Products Table */}
            <div className="modern-table-container">
                {loading ? (
                    <div className="loading-modern">
                        <div className="loading-spinner"></div>
                        <span>Loading products...</span>
                    </div>
                ) : error ? (
                    <div className="error-modern">
                        <div className="error-icon">⚠️</div>
                        <div className="error-content">
                            <h4>Unable to load products</h4>
                            <p>{error}</p>
                            <button onClick={() => fetchProducts()} className="btn-modern-secondary">
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-modern">
                        <div className="empty-icon">📦</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search filters or create a new product.</p>
                        <button onClick={openCreateModal} className="btn-modern-primary">
                            Create Product
                        </button>
                    </div>
                ) : (
                    <div className="modern-table">
                        <div className="table-header-modern">
                            <div className="table-row-modern header">
                                <div className="table-cell">
                                    <span className="column-title">Product Information</span>
                                </div>
                                <div className="table-cell">
                                    <span className="column-title">Category</span>
                                </div>
                                <div className="table-cell">
                                    <span className="column-title">Brand</span>
                                </div>
                                <div className="table-cell">
                                    <span className="column-title">Base Price</span>
                                </div>
                                <div className="table-cell">
                                    <span className="column-title">Color Variants</span>
                                </div>
                                <div className="table-cell">
                                    <span className="column-title">Status</span>
                                </div>
                                <div className="table-cell actions">
                                    <span className="column-title">Actions</span>
                                </div>
                            </div>
                        </div>
                        <div className="table-body-modern">
                            {products.map(product => (
                                <div key={product.id} className={`table-row-modern ${product.deleted_at ? 'deleted' : ''}`}>
                                    <div className="table-cell product-info">
                                        <div className="product-image-modern">
                                            {/* FIXED: Use safe product parameter */}
                                            <img 
                                                src={getProductImage(product)} 
                                                alt={product.name}
                                                onError={(e) => {
                                                    const img = e.target;
                                                    if (img.src && !img.src.includes('data:image/svg+xml')) {
                                                        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjhGOUZBIi8+Cjx0ZXh0IHg9IjI1IiB5PSIyOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2NjY2Ij5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K';
                                                    }
                                                }}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="product-details-modern">
                                            <div className="product-name-modern">{product.name}</div>
                                            <div className="product-sku-modern">
                                                {product.variants && product.variants.length > 0 ? product.variants[0]?.sku : 'No SKU'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-cell">
                                        <span className="category-tag">
                                            {product.category?.display_name || 'Uncategorized'}
                                        </span>
                                    </div>
                                    <div className="table-cell">
                                        <span className="brand-name">{product.brand}</span>
                                    </div>
                                    <div className="table-cell">
                                        <span className="price-modern">
                                            {product.base_price ? formatPrice(product.base_price) : '₱0.00'}
                                        </span>
                                    </div>
                                    <div className="table-cell">
                                        <div className="variants-modern">
                                            <span className="variants-count">
                                                {(product.variants?.length || 0)} colors
                                            </span>
                                            {product.variants && product.variants.length > 0 && (
                                                <div className="color-swatches-modern">
                                                    {product.variants.slice(0, 4).map(variant => (
                                                        <div 
                                                            key={variant.id || variant.color}
                                                            className="color-swatch-modern"
                                                            style={{ backgroundColor: variant.hex_code || '#000000' }}
                                                            title={variant.color || 'No color'}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="table-cell">
                                        {getStatusBadge(product)}
                                    </div>
                                    <div className="table-cell actions">
                                        <div className="action-buttons-modern">
                                            {product.deleted_at ? (
                                                <button 
                                                    className="btn-action restore"
                                                    onClick={() => handleRestore(product.id)}
                                                    title="Restore Product"
                                                >
                                                    Restore
                                                </button>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="btn-action edit"
                                                        onClick={() => openEditModal(product)}
                                                        title="Edit Product"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn-action delete"
                                                        onClick={() => {
                                                            setProductToDelete(product);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        title="Archive Product"
                                                    >
                                                        Archive
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
                <div className="pagination-modern">
                    <button 
                        className="pagination-btn-modern"
                        disabled={currentPage === 1}
                        onClick={() => fetchProducts(currentPage - 1)}
                    >
                        ← Previous
                    </button>
                    
                    <div className="pagination-numbers-modern">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`pagination-number-modern ${currentPage === page ? 'active' : ''}`}
                                onClick={() => fetchProducts(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        className="pagination-btn-modern"
                        disabled={currentPage === totalPages}
                        onClick={() => fetchProducts(currentPage + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Modern Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <ModernModal onClose={() => setShowDeleteModal(false)}>
                    <div className="modal-content-delete">
                        <div className="modal-icon warning">⚠️</div>
                        <h3>Archive Product</h3>
                        <p>Are you sure you want to archive <strong>{productToDelete.name}</strong>?</p>
                        <p className="modal-note">This product will be moved to archive and can be restored later.</p>
                        <div className="modal-actions">
                            <button 
                                className="btn-modern-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-modern-danger"
                                onClick={() => handleDelete(productToDelete.id)}
                            >
                                Archive Product
                            </button>
                        </div>
                    </div>
                </ModernModal>
            )}

            {/* Modern Product Form Modal */}
            {(showCreateModal || showEditModal) && (
                <ModernModal onClose={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                }}>
                    <ProductFormModal
                        title={showEditModal ? `Edit ${editingProduct.name}` : 'Create New Product'}
                        formData={formData}
                        formErrors={formErrors}
                        formLoading={formLoading}
                        categories={categories}
                        activeTab={activeFormTab}
                        onTabChange={setActiveFormTab}
                        onInputChange={handleInputChange}
                        onVariantChange={handleVariantChange}
                        onSpecChange={handleSpecChange}
                        onAddVariant={addVariant}
                        onRemoveVariant={removeVariant}
                        onAddSpecification={addSpecification}
                        onRemoveSpecification={removeSpecification}
                        onSubmit={submitForm}
                        onClose={() => {
                            setShowCreateModal(false);
                            setShowEditModal(false);
                        }}
                    />
                </ModernModal>
            )}
        </div>
    );
};

// Modern Modal Component with Scroll Fix
const ModernModal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay-modern" onClick={onClose}>
            <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-modern" onClick={onClose}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

// Modern Product Form Modal Component with Scrollable Content
const ProductFormModal = ({ 
    title, 
    formData, 
    formErrors, 
    formLoading, 
    categories,
    activeTab,
    onTabChange,
    onInputChange, 
    onVariantChange, 
    onSpecChange,
    onAddVariant, 
    onRemoveVariant,
    onAddSpecification,
    onRemoveSpecification,
    onSubmit, 
    onClose 
}) => {
    const formTabs = [
        { id: 'basic', label: 'Basic Info', icon: '📝' },
        { id: 'variants', label: 'Variants', icon: '🎨' },
        { id: 'specs', label: 'Specifications', icon: '⚙️' }
    ];

    return (
        <div className="product-form-modal">
            <div className="modal-header-modern">
                <h2>{title}</h2>
            </div>
            
            {/* Tab Navigation */}
            <div className="form-tabs">
                {formTabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`form-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <form onSubmit={onSubmit} className="product-form-modern">
                {/* Scroll Container */}
                <div className="form-scroll-container">
                    <div className="form-content">
                        {/* Basic Information Tab */}
                        {activeTab === 'basic' && (
                            <div className="form-tab-content">
                                <div className="form-grid-modern">
                                    <div className="form-group-modern">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => onInputChange('name', e.target.value)}
                                            className={`form-input-modern ${formErrors.name ? 'error' : ''}`}
                                            disabled={formLoading}
                                            placeholder="Enter product name"
                                        />
                                        {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label">Brand</label>
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={(e) => onInputChange('brand', e.target.value)}
                                            className={`form-input-modern ${formErrors.brand ? 'error' : ''}`}
                                            disabled={formLoading}
                                            placeholder="Enter brand name"
                                        />
                                        {formErrors.brand && <span className="form-error">{formErrors.brand}</span>}
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label">Base Price (₱)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.base_price}
                                            onChange={(e) => onInputChange('base_price', e.target.value)}
                                            className={`form-input-modern ${formErrors.base_price ? 'error' : ''}`}
                                            disabled={formLoading}
                                            placeholder="0.00"
                                        />
                                        {formErrors.base_price && <span className="form-error">{formErrors.base_price}</span>}
                                        <div className="form-hint">
                                            Changing base price will update all variant prices that haven't been manually edited
                                        </div>
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label">Category</label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) => onInputChange('category_id', e.target.value)}
                                            className={`form-input-modern ${formErrors.category_id ? 'error' : ''}`}
                                            disabled={formLoading}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.category_id && <span className="form-error">{formErrors.category_id}</span>}
                                    </div>
                                </div>

                                <div className="form-group-modern full-width">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => onInputChange('description', e.target.value)}
                                        rows="4"
                                        className={`form-input-modern ${formErrors.description ? 'error' : ''}`}
                                        disabled={formLoading}
                                        placeholder="Enter product description..."
                                    />
                                    {formErrors.description && <span className="form-error">{formErrors.description}</span>}
                                </div>
                            </div>
                        )}

                        {/* Variants Tab */}
                        {activeTab === 'variants' && (
                            <div className="form-tab-content">
                                <div className="section-header-modern">
                                    <h3>Product Variants</h3>
                                    <button 
                                        type="button" 
                                        className="btn-modern-secondary"
                                        onClick={onAddVariant}
                                        disabled={formLoading}
                                    >
                                        + Add Variant
                                    </button>
                                </div>
                                
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="variant-card">
                                        <div className="variant-header">
                                            <h4>
                                                Variant {index + 1}
                                                {variant.manuallyEdited && (
                                                    <span className="manual-edit-indicator" title="Manually edited price">✏️</span>
                                                )}
                                            </h4>
                                            {formData.variants.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-action delete small"
                                                    onClick={() => onRemoveVariant(index)}
                                                    disabled={formLoading}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="form-grid-modern">
                                            <div className="form-group-modern">
                                                <label className="form-label">Color Name</label>
                                                <input
                                                    type="text"
                                                    value={variant.color}
                                                    onChange={(e) => onVariantChange(index, 'color', e.target.value)}
                                                    className={`form-input-modern ${formErrors[`variant_${index}_color`] ? 'error' : ''}`}
                                                    disabled={formLoading}
                                                    placeholder="e.g., Black, Red"
                                                />
                                                {formErrors[`variant_${index}_color`] && (
                                                    <span className="form-error">{formErrors[`variant_${index}_color`]}</span>
                                                )}
                                            </div>

                                            <div className="form-group-modern">
                                                <label className="form-label">Color Code</label>
                                                <div className="color-picker-modern">
                                                    <input
                                                        type="color"
                                                        value={variant.hex_code}
                                                        onChange={(e) => onVariantChange(index, 'hex_code', e.target.value)}
                                                        disabled={formLoading}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={variant.hex_code}
                                                        onChange={(e) => onVariantChange(index, 'hex_code', e.target.value)}
                                                        disabled={formLoading}
                                                        className="form-input-modern"
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group-modern">
                                                <label className="form-label">
                                                    Price (₱) 
                                                    {variant.manuallyEdited && (
                                                        <span className="manual-badge" title="Manually edited">Manual</span>
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={variant.price}
                                                    onChange={(e) => onVariantChange(index, 'price', e.target.value)}
                                                    className={`form-input-modern ${formErrors[`variant_${index}_price`] ? 'error' : ''} ${variant.manuallyEdited ? 'manual-edit' : ''}`}
                                                    disabled={formLoading}
                                                    placeholder="0.00"
                                                />
                                                {formErrors[`variant_${index}_price`] && (
                                                    <span className="form-error">{formErrors[`variant_${index}_price`]}</span>
                                                )}
                                                {variant.manuallyEdited && (
                                                    <div className="form-hint">
                                                        This price is manually set and won't sync with base price
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group-modern">
                                                <label className="form-label">Stock</label>
                                                <input
                                                    type="number"
                                                    value={variant.stock_quantity}
                                                    onChange={(e) => onVariantChange(index, 'stock_quantity', e.target.value)}
                                                    className={`form-input-modern ${formErrors[`variant_${index}_stock`] ? 'error' : ''}`}
                                                    disabled={formLoading}
                                                    placeholder="0"
                                                />
                                                {formErrors[`variant_${index}_stock`] && (
                                                    <span className="form-error">{formErrors[`variant_${index}_stock`]}</span>
                                                )}
                                            </div>

                                            <div className="form-group-modern">
                                                <label className="form-label">SKU</label>
                                                <input
                                                    type="text"
                                                    value={variant.sku}
                                                    onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
                                                    className={`form-input-modern ${formErrors[`variant_${index}_sku`] ? 'error' : ''}`}
                                                    disabled={formLoading}
                                                    placeholder="RX-HEL-001"
                                                />
                                                {formErrors[`variant_${index}_sku`] && (
                                                    <span className="form-error">{formErrors[`variant_${index}_sku`]}</span>
                                                )}
                                            </div>

                                            <div className="form-group-modern full-width">
                                                <label className="form-label">Image Path</label>
                                                <input
                                                    type="text"
                                                    value={variant.image_url}
                                                    onChange={(e) => onVariantChange(index, 'image_url', e.target.value)}
                                                    className={`form-input-modern ${formErrors[`variant_${index}_image`] ? 'error' : ''}`}
                                                    disabled={formLoading}
                                                    placeholder="/img/category/filename.jpg"
                                                />
                                                {formErrors[`variant_${index}_image`] && (
                                                    <span className="form-error">{formErrors[`variant_${index}_image`]}</span>
                                                )}
                                                {variant.image_url && (
                                                    <div className="image-preview-modern">
                                                        <img 
                                                            src={variant.image_url.startsWith('/') ? variant.image_url : '/' + variant.image_url} 
                                                            alt="Preview" 
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <span>Image Preview</span>
                                                    </div>
                                                )}
                                                <div className="form-hint">
                                                    Use local paths like: /img/helmets/product-image.jpg
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Specifications Tab */}
                        {activeTab === 'specs' && (
                            <div className="form-tab-content">
                                <div className="section-header-modern">
                                    <h3>Specifications</h3>
                                    <button 
                                        type="button" 
                                        className="btn-modern-secondary"
                                        onClick={onAddSpecification}
                                        disabled={formLoading}
                                    >
                                        + Add Specification
                                    </button>
                                </div>
                                
                                {formData.specifications.map((spec, index) => (
                                    <div key={index} className="spec-card">
                                        <div className="form-grid-modern">
                                            <div className="form-group-modern">
                                                <input
                                                    type="text"
                                                    value={spec.key}
                                                    onChange={(e) => onSpecChange(index, 'key', e.target.value)}
                                                    disabled={formLoading}
                                                    className="form-input-modern"
                                                    placeholder="Specification name"
                                                />
                                            </div>
                                            <div className="form-group-modern">
                                                <input
                                                    type="text"
                                                    value={spec.value}
                                                    onChange={(e) => onSpecChange(index, 'value', e.target.value)}
                                                    disabled={formLoading}
                                                    className="form-input-modern"
                                                    placeholder="Specification value"
                                                />
                                            </div>
                                            <div className="form-group-modern">
                                                <button
                                                    type="button"
                                                    className="btn-action delete small"
                                                    onClick={() => onRemoveSpecification(index)}
                                                    disabled={formLoading}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions-modern">
                    <button 
                        type="button"
                        className="btn-modern-secondary"
                        onClick={onClose}
                        disabled={formLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn-modern-primary"
                        disabled={formLoading}
                    >
                        {formLoading ? (
                            <>
                                <div className="loading-spinner-small"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Product'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProducts;