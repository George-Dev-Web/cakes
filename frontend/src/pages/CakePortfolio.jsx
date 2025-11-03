import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import CakeCard from "../components/CakeCard";
import { fetchAdminCakes } from "../utils/api"; // <-- using your existing API util
import "./CakePortfolio.css";

const CakePortfolio = () => {
  const { isDarkMode } = useTheme();
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCakes = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminCakes();
        setCakes(data);
        setFilteredCakes(data);
      } catch (err) {
        console.error("Failed to load cakes:", err);
        setError("Could not fetch cakes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCakes();
  }, []);

  useEffect(() => {
    let results = cakes.filter((cake) =>
      cake.name.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "all") {
      results = results.filter(
        (cake) => cake.category?.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredCakes(results);
  }, [search, category, cakes]);

  const handleCardClick = (cake) => {
    alert(`Clicked on ${cake.name}`); // you can replace this with a modal later
  };

  return (
    <div className={`cake-portfolio ${isDarkMode ? "dark" : ""}`}>
      <header className="portfolio-header">
        <h2>Our Cake Collection</h2>
        <p>Explore a world of sweetness crafted just for you.</p>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search cakes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="chocolate">Chocolate</option>
          <option value="vanilla">Vanilla</option>
          <option value="red velvet">Red Velvet</option>
          <option value="fruit">Fruit</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading cakes...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredCakes.length > 0 ? (
        <div className="cake-grid">
          {filteredCakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              isDarkMode={isDarkMode}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">No cakes found.</p>
      )}
    </div>
  );
};

export default CakePortfolio;
