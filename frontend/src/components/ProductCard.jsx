// frontend/src/components/ProductCard.jsx
import "./ProductCard.css";

const ProductCard = ({ product, onAddToOrder }) => {
  // Format price as Kenyan Shillings
  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString("en-KE")}`;
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
        <button className="btn" onClick={() => onAddToOrder(product)}>
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
