import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=d356f58cc6aa4593920c9ef5818cda62`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setError("Failed to fetch recipe details. Please try again later.");
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="loading-message">Fetching recipe details...</div>;
  }

  return (
    <div className="recipe-detail-container">
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      
      <div className="ingredients">
        <h2>Ingredients</h2>
        <ul>
          {recipe.extendedIngredients &&
            recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
        </ul>
      </div>

      <div className="instructions">
        <h2>Instructions</h2>
        <p>{recipe.instructions || "No instructions available for this recipe."}</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
