// frontend/src/components/Hero.jsx
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleViewAllCakes = () => {
    navigate("/cakes");
  };
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Delicious Artisanal Cakes</h1>
        <p>
          Handcrafted with love and the finest ingredients for your special
          moments
        </p>
        <button className="btn" onClick={handleViewAllCakes}>
          Explore Our Cakes
        </button>
      </div>
    </section>
  );
};

export default Hero;
