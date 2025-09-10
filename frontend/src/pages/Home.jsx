// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ContactForm from "../components/ContactForm";
import { fetchCakes } from "../utils/api";
import "./Home.css";

const Home = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCakes = async () => {
      try {
        // For Phase 1, we'll use mock data
        // In Phase 2, we'll replace this with actual API call
        const cakesData = await fetchCakes();
        setCakes(cakesData);
      } catch (err) {
        setError("Failed to load cakes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCakes();
  }, []);

  const handleAddToOrder = (product) => {
    // This will be connected to order context in Phase 2
    console.log("Added to order:", product);
    alert(`${product.name} added to your order!`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <Hero />
      <section id="products" className="products-section">
        <div className="container">
          <h2>Our Cake Selection</h2>
          <p>Choose from our delicious range of custom cakes</p>
          <div className="products-grid">
            {cakes.map((cake) => (
              <ProductCard
                key={cake.id}
                product={cake}
                onAddToOrder={handleAddToOrder}
              />
            ))}
          </div>
        </div>
      </section>
      <ContactForm />
    </div>
  );
};

export default Home;
