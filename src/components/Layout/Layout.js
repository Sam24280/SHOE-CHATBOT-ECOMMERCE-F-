import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import ChatWidget from '../Chat/ChatWidget';
import { cartAPI } from '../../utils/api';
import { useAuth } from '../../utils/auth';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      const items = response.data.items || [];
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateCartCount = () => {
    fetchCart();
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header cartCount={cartCount} />
      
      <Container fluid className="flex-grow-1 px-4">
        <main>
          {React.cloneElement(children, { 
            updateCartCount, 
            cartItems, 
            fetchCart 
          })}
        </main>
      </Container>
      
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <Container>
          <p className="mb-0">
            © 2024 ShoeBot Store. Made with ❤️ and AI
          </p>
        </Container>
      </footer>
      
      {isAuthenticated() && (
        <ChatWidget 
          updateCartCount={updateCartCount}
          cartItems={cartItems}
        />
      )}
    </div>
  );
};

export default Layout;