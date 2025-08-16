import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart, compact = false }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    setIsAdding(true);
    try {
      await onAddToCart(product, selectedSize, selectedColor);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`product-card ${compact ? 'compact' : ''}`}>
      <div className="product-image">
        <img 
          src={product.image || '/images/shoes/placeholder.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/images/shoes/placeholder.jpg';
          }}
        />
      </div>
      
      <div className="product-info">
        <h5 className="product-name">{product.name}</h5>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">${product.price}</p>
        
        {!compact && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-options">
          {/* Size Selection */}
          <div className="option-group">
            <label>Size:</label>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
              className="form-select"
            >
              <option value="">Select Size</option>
              {product.sizes?.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          {/* Color Selection */}
          <div className="option-group">
            <label>Color:</label>
            <select 
              value={selectedColor} 
              onChange={(e) => setSelectedColor(e.target.value)}
              className="form-select"
            >
              <option value="">Select Color</option>
              {product.colors?.map(color => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isAdding || !selectedSize || !selectedColor}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
