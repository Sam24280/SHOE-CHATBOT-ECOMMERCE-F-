import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = ({ cartItems, onClearCart }) => {
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'card',
    cardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      navigate('/products');
      return;
    }
  }, [cartItems, navigate]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return getTotalPrice() > 100 ? 0 : 10;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost();
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate shipping address
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
    requiredFields.forEach(field => {
      if (!formData.shippingAddress[field]) {
        newErrors[`shippingAddress.${field}`] = 'This field is required';
      }
    });

    // Validate payment details (mock validation)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardDetails.cardNumber || formData.cardDetails.cardNumber.length < 16) {
        newErrors['cardDetails.cardNumber'] = 'Valid card number required';
      }
      if (!formData.cardDetails.expiryDate) {
        newErrors['cardDetails.expiryDate'] = 'Expiry date required';
      }
      if (!formData.cardDetails.cvv || formData.cardDetails.cvv.length < 3) {
        newErrors['cardDetails.cvv'] = 'Valid CVV required';
      }
      if (!formData.cardDetails.cardholderName) {
        newErrors['cardDetails.cardholderName'] = 'Cardholder name required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalAmount: getFinalTotal()
      };

      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderPlaced(true);
      onClearCart();
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card">
              <div className="card-body py-5">
                <i className="fas fa-check-circle fa-5x text-success mb-4"></i>
                <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                <p className="text-muted mb-4">
                  Thank you for your purchase. You will receive a confirmation email shortly.
                </p>
                <p className="small text-muted">Redirecting to home page...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Checkout</h2>
      
      <div className="row">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['shippingAddress.street'] ? 'is-invalid' : ''}`}
                      value={formData.shippingAddress.street}
                      onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                    />
                    {errors['shippingAddress.street'] && (
                      <div className="invalid-feedback">{errors['shippingAddress.street']}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['shippingAddress.city'] ? 'is-invalid' : ''}`}
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                    />
                    {errors['shippingAddress.city'] && (
                      <div className="invalid-feedback">{errors['shippingAddress.city']}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['shippingAddress.state'] ? 'is-invalid' : ''}`}
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                    />
                    {errors['shippingAddress.state'] && (
                      <div className="invalid-feedback">{errors['shippingAddress.state']}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['shippingAddress.zipCode'] ? 'is-invalid' : ''}`}
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                    />
                    {errors['shippingAddress.zipCode'] && (
                      <div className="invalid-feedback">{errors['shippingAddress.zipCode']}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['shippingAddress.country'] ? 'is-invalid' : ''}`}
                      value={formData.shippingAddress.country}
                      onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                    />
                    {errors['shippingAddress.country'] && (
                      <div className="invalid-feedback">{errors['shippingAddress.country']}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Payment Method</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />
                    <label className="form-check-label" htmlFor="card">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />
                    <label className="form-check-label" htmlFor="cod">
                      Cash on Delivery
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">Cardholder Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors['cardDetails.cardholderName'] ? 'is-invalid' : ''}`}
                        value={formData.cardDetails.cardholderName}
                        onChange={(e) => handleInputChange('cardDetails', 'cardholderName', e.target.value)}
                      />
                      {errors['cardDetails.cardholderName'] && (
                        <div className="invalid-feedback">{errors['cardDetails.cardholderName']}</div>
                      )}
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label className="form-label">Card Number *</label>
                      <input
                        type="text"
                        className={`form-control ${errors['cardDetails.cardNumber'] ? 'is-invalid' : ''}`}
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardDetails.cardNumber}
                        onChange={(e) => handleInputChange('cardDetails', 'cardNumber', e.target.value)}
                        maxLength="19"
                      />
                      {errors['cardDetails.cardNumber'] && (
                        <div className="invalid-feedback">{errors['cardDetails.cardNumber']}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="text"
                        className={`form-control ${errors['cardDetails.expiryDate'] ? 'is-invalid' : ''}`}
                        placeholder="MM/YY"
                        value={formData.cardDetails.expiryDate}
                        onChange={(e) => handleInputChange('cardDetails', 'expiryDate', e.target.value)}
                        maxLength="5"
                      />
                      {errors['cardDetails.expiryDate'] && (
                        <div className="invalid-feedback">{errors['cardDetails.expiryDate']}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CVV *</label>
                      <input
                        type="text"
                        className={`form-control ${errors['cardDetails.cvv'] ? 'is-invalid' : ''}`}
                        placeholder="123"
                        value={formData.cardDetails.cvv}
                        onChange={(e) => handleInputChange('cardDetails', 'cvv', e.target.value)}
                        maxLength="4"
                      />
                      {errors['cardDetails.cvv'] && (
                        <div className="invalid-feedback">{errors['cardDetails.cvv']}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing Order...
                </>
              ) : (
                `Place Order - $${getFinalTotal().toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cartItems.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small">
                    <strong>{item.product.name}</strong><br/>
                    Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                  </div>
                  <span className="small">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <hr/>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${getShippingCost().toFixed(2)}</span>
              </div>
              
              {getShippingCost() === 0 && (
                <small className="text-success">Free shipping on orders over $100!</small>
              )}
              
              <hr/>
              
              <div className="d-flex justify-content-between">
                <strong>Total: ${getFinalTotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;