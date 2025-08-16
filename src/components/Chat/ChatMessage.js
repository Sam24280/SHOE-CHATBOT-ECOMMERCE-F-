import React from 'react';
import ProductCard from './ProductCard';

const ChatMessage = ({ message, onAddToCart }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`message ${message.type}`}>
      <div className="message-bubble">
        <div className="message-content">
          {message.content}
        </div>
        
        {/* Display products if any */}
        {message.products && message.products.length > 0 && (
          <div className="products-container">
            <div className="products-grid">
              {message.products.map((product, index) => (
                <ProductCard
                  key={`${product._id}-${index}`}
                  product={product}
                  onAddToCart={onAddToCart}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;