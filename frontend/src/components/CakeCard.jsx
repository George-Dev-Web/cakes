import React from "react";
import "./CakeCard.css";

const CakeCard = ({ cake, onClick, isDarkMode }) => {
  return (
    <div
      className={`cake-card ${isDarkMode ? "dark" : ""}`}
      onClick={() => onClick && onClick(cake)}
    >
      <img src={cake.image} alt={cake.name} />
      <div className="cake-info">
        <h3>{cake.name}</h3>
        <p>{cake.description}</p>
        <strong>${cake.price}</strong>
      </div>
    </div>
  );
};

export default CakeCard;
