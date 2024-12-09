import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./Search.css";


const Search = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (!query) return; // Don't make API call if query is empty

    setLoading(true); // Show loading indicator
    setError(null); // Reset error state

    try {
      // Replace YOUR_API_KEY with your actual Spoonacular API key
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=d356f58cc6aa4593920c9ef5818cda62`
      );

      setRecipes(response.data.results); // Save recipes to state
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch recipes. Please try again."); // Handle error
    }

    setLoading(false); // Hide loading indicator
  };

  return (
    <div className="info">

      <h1 className="search-header">Find Your Favorite Recipes</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Enter a recipe or ingredient..."
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>

      {loading && <p>Loading...</p>} 
      {error && <p className="error-message">{error}</p>} 

    <div className="search-container">
      <div className="recipe-results">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-item">
                <Link to={`/recipe/${recipe.id}`}>
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} />
                </Link>
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Search;