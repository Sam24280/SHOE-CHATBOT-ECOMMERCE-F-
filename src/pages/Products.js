import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/Chat/ProductCard';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  // removed misplaced import

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= Number(filters.maxPrice));
    }

    // Size filter
    if (filters.size) {
      filtered = filtered.filter(product => 
        product.sizes.includes(Number(filters.size))
      );
    }

    // Color filter
    if (filters.color) {
      filtered = filtered.filter(product => 
        product.colors.some(color => 
          color.toLowerCase().includes(filters.color.toLowerCase())
        )
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      
      // Extract unique categories and brands for filters
      const uniqueCategories = [...new Set(response.data.map(p => p.category))];
      const uniqueBrands = [...new Set(response.data.map(p => p.brand))];
      
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      search: ''
    });
  };

  return (
    <div className="products-page">
      <div className="container py-4">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-4 fw-bold">All Products</h1>
            <p className="lead text-muted">
              Browse our complete collection of quality shoes
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Filter Products</h5>
                
                <div className="row">
                  {/* Search */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Search</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search shoes..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Brand</label>
                    <select
                      className="form-select"
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                    >
                      <option value="">All Brands</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Sort By</label>
                    <select
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="brand">Brand</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  {/* Price Range */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Min Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Max Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="$500"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>

                  {/* Size */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Size</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Size"
                      value={filters.size}
                      onChange={(e) => handleFilterChange('size', e.target.value)}
                    />
                  </div>

                  {/* Color */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Color"
                      value={filters.color}
                      onChange={(e) => handleFilterChange('color', e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </button>
                    <span className="ms-3 text-muted">
                      Showing {filteredProducts.length} of {products.length} products
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="row">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <div className="placeholder bg-secondary mb-3" style={{height: '200px'}}></div>
                      <h5 className="card-title">
                        <span className="placeholder col-8"></span>
                      </h5>
                      <p className="card-text">
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-4"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="row">
            {filteredProducts.map((product) => (
              <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <ProductCard product={product} showActions={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="empty-state">
                <i className="fas fa-search fa-4x text-muted mb-3"></i>
                <h3>No products found</h3>
                <p className="text-muted">
                  Try adjusting your filters or search terms
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;