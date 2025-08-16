import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import CartSidebar from '../Cart/CartSidebar';

const Header = ({ cartCount = 0 }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            👟 ShoeBot Store
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
            </Nav>
            
            <Nav className="ms-auto d-flex align-items-center">
              {isAuthenticated() ? (
                <>
                  <Button 
                    variant="outline-light" 
                    className="me-3 position-relative"
                    onClick={toggleCart}
                  >
                    🛒 Cart
                    {cartCount > 0 && (
                      <Badge 
                        bg="danger" 
                        className="position-absolute top-0 start-100 translate-middle rounded-pill"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <div className="text-light me-3">
                    Welcome, {user?.username}
                  </div>
                  
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline-light" 
                    className="me-2"
                    as={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="light" 
                    as={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CartSidebar show={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;