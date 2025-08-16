import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';


const ChatWidget = ({ user, onCartUpdate }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m here to help you find the perfect shoes. You can ask me to show you products, add items to your cart, or help with checkout!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      const botMessage = {
        type: 'bot',
        content: data.response,
        products: data.products || [],
        intent: data.intent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // If cart was updated, notify parent component
      if (data.intent === 'add_to_cart' || data.intent === 'remove_from_cart') {
        onCartUpdate && onCartUpdate();
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again or contact support.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAddToCart = async (product, size, color) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          size: size,
          color: color,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const botMessage = {
        type: 'bot',
        content: `Great! I've added the ${product.name} in ${color} (size ${size}) to your cart.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      onCartUpdate && onCartUpdate();

    } catch (error) {
      console.error('Add to cart error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I couldn\'t add that item to your cart. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div 
        className={`chat-widget-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="chat-icon">
          {isOpen ? '×' : '💬'}
        </div>
      </div>

      {/* Chat Widget */}
      <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h4>Shoe Assistant</h4>
          <button 
            className="close-btn"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              onAddToCart={handleAddToCart}
            />
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Bot is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about shoes, add items to cart, or get help..."
            disabled={isLoading}
            rows="2"
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;