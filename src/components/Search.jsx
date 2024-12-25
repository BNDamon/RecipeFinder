import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0); 
  const [hasMore, setHasMore] = useState(true); 

  const observerRef = useRef(); 

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const fetchRecipes = async (newSearch = false) => {
    if (loading || (!hasMore && !newSearch)) return; 

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&offset=${newSearch ? 0 : offset}&number=10&apiKey=d356f58cc6aa4593920c9ef5818cda62`
      );

      if (newSearch) {
        setRecipes(response.data.results); 
      } else {
        setRecipes((prevRecipes) => [...prevRecipes, ...response.data.results]); 
      }

      setOffset((prevOffset) => prevOffset + 10); 
      if (response.data.results.length < 10) setHasMore(false); 
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch recipes. Please try again.");
    }

    setLoading(false);
  };

  const handleSearch = () => {
    if (!query) return;
    setOffset(0);
    setHasMore(true);
    fetchRecipes(true); 
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRecipes(); 
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [offset, hasMore]);

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
        <div ref={observerRef} className="loading-trigger">
          {loading && <p>Loading more...</p>}
        </div>
      </div>
    </div>
  );
};

export default Search;
