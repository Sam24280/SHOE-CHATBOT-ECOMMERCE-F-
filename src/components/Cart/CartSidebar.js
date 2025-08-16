import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data.items || []);
      setTotal(data.total || 0);

    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: itemId,
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }

      await fetchCartItems();
      onCartUpdate && onCartUpdate();

    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      await fetchCartItems();
      onCartUpdate && onCartUpdate();

    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    onClose();
    navigate('/checkout');
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      await fetchCartItems();
      onCartUpdate && onCartUpdate();

    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-content">
          {isLoading ? (
            <div className="cart-loading">
              <p>Loading cart items...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={`${item.product._id}-${item.size}-${item.color}`} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.product.image || '/images/shoes/placeholder.jpg'} 
                        alt={item.product.name}
                        onError={(e) => {
                          e.target.src = '/images/shoes/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p className="item-brand">{item.product.brand}</p>
                      <p className="item-specs">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="item-price">${item.product.price}</p>
                      
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <h4>Total: ${total.toFixed(2)}</h4>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  
                  <button 
                    className="checkout-btn"
                    onClick={proceedToCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;