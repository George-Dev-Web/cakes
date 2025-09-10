// frontend/src/components/Hero.jsx
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Delicious Artisanal Cakes</h1>
        <p>
          Handcrafted with love and the finest ingredients for your special
          moments
        </p>
        <a href="#products" className="btn">
          Explore Our Cakes
        </a>
      </div>
    </section>
  );
};

export default Hero;
