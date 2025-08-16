import React, { useState, useEffect } from 'react';
import ChatWidget from '../components/Chat/ChatWidget';
import ProductCard from '../components/Chat/ProductCard';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // Local fallback shoes (if API doesn't return data)
  const fallbackShoes = [
    {
      id: 1,
      name: "Nike Air Max",
      price: "$120",
      description: "Comfortable running shoes with modern design.",
      image: "/images/nike-air-max.jpg"
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: "$150",
      description: "High-performance shoes with soft cushioning.",
      image: "/images/adidas1-ultraboost.jpg"
    },
    {
      id: 3,
      name: "Puma RS-X",
      price: "$110",
      description: "Stylish sneakers with bold colors.",
      image: "/images/puma-rsx.jpg"
    }
  ];

  // ✅ Fetch featured products from backend
  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products?featured=true&limit=6"
      );
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setFeaturedProducts(fallbackShoes); // fallback if API fails
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once on mount
  useEffect(() => {
    fetchFeaturedProducts();
  },);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Find Your Perfect Shoes with AI
              </h1>
              <p className="lead mb-4">
                Chat with our AI assistant to discover shoes that match your style, 
                size, and preferences. Get personalized recommendations instantly!
              </p>
              <button 
                className="btn btn-light btn-lg"
                onClick={() => setChatOpen(true)}
              >
                Start Shopping with AI
              </button>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img 
                  src="/images/shoes-hero.png" 
                  alt="Collection of shoes" 
                  className="img-fluid rounded shadow"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold">Featured Products</h2>
              <p className="lead text-muted">
                Discover our most popular shoes or ask our AI for recommendations
              </p>
            </div>
          </div>

          {loading ? (
            <div className="row">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="placeholder-glow">
                        <div className="placeholder bg-secondary" style={{height: '200px'}}></div>
                        <p className="card-text">
                          <span className="placeholder col-7"></span>
                          <span className="placeholder col-4"></span>
                          <span className="placeholder col-6"></span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row">
              {featuredProducts.map((product) => (
                <div key={product.id || product._id} className="col-lg-4 col-md-6 mb-4">
                  <ProductCard product={product} showActions={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold">How It Works</h2>
              <p className="lead text-muted">Shopping with AI has never been easier</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 text-center mb-4">
              <div className="feature-icon mb-3">
                <i className="fas fa-comments fa-3x text-primary"></i>
              </div>
              <h4>Chat with AI</h4>
              <p className="text-muted">
                Tell our AI what you're looking for in natural language. 
                "Show me running shoes" or "I need black formal shoes size 10"
              </p>
            </div>
            <div className="col-lg-4 text-center mb-4">
              <div className="feature-icon mb-3">
                <i className="fas fa-search fa-3x text-primary"></i>
              </div>
              <h4>Get Recommendations</h4>
              <p className="text-muted">
                Our AI understands your preferences and shows you the perfect matches 
                from our curated collection of quality shoes.
              </p>
            </div>
            <div className="col-lg-4 text-center mb-4">
              <div className="feature-icon mb-3">
                <i className="fas fa-shopping-cart fa-3x text-primary"></i>
              </div>
              <h4>Easy Purchase</h4>
              <p className="text-muted">
                Add items to cart and checkout seamlessly. 
                The AI can even help you complete your order!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">
            Ready to Find Your Perfect Shoes?
          </h2>
          <p className="lead mb-4">
            Start chatting with our AI assistant now and discover shoes you'll love!
          </p>
          <button 
            className="btn btn-primary btn-lg me-3"
            onClick={() => setChatOpen(true)}
          >
            Chat Now
          </button>
          <a href="/products" className="btn btn-outline-primary btn-lg">
            Browse All Products
          </a>
        </div>
      </section>

      {/* Chat Widget */}
      {chatOpen && (
        <div className="chat-overlay">
          <div className="chat-container">
            <div className="chat-header">
              <h5 className="mb-0">AI Shopping Assistant</h5>
              <button 
                className="btn-close" 
                onClick={() => setChatOpen(false)}
              ></button>
            </div>
            <ChatWidget />
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button 
          className="floating-chat-btn btn btn-primary rounded-circle"
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <i className="fas fa-comments"></i>
        </button>
      )}
    </div>
  );
};

export default Home;
