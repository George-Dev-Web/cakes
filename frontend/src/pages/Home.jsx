// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { fetchCakes } from "../utils/api";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCakes = async () => {
      try {
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
    console.log("Added to order:", product);
    alert(`${product.name} added to your order!`);
  };

  const handleViewAllCakes = () => {
    navigate("/cakes"); // Replace with your cake portfolio route
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Show only first 4 cakes for mini portfolio
  const miniCakes = cakes.slice(0, 4);

  return (
    <div className="home">
      <section className="hero-section">
        <Hero />
      </section>

      {/* <section className="about-section">
        <div className="container">
          <h2>About Us</h2>
          <p>
            Welcome to Velvet Bloom! We craft custom cakes that make every
            occasion special. From classic flavors to unique designs, our
            creations are made to delight.
          </p>
        </div>
      </section> */}

      <section className="mini-portfolio-section">
        <div className="container">
          <h2>Our Cake Selection</h2>
          <p>Check out a few of our delicious cakes</p>
          <div className="mini-portfolio-grid">
            {miniCakes.map((cake) => (
              <ProductCard
                key={cake.id}
                product={cake}
                onAddToOrder={handleAddToOrder}
              />
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn" onClick={handleViewAllCakes}>
              View All Cakes
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
