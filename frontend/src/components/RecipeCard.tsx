import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
  <Link className="recipe-card" to={`/recipe/${recipe.id}`}>
    {recipe.imageUrl && (
      <img src={recipe.imageUrl} alt={recipe.title} className="recipe-card-img" />
    )}
    <div className="recipe-card-content">
      <h3>{recipe.title}</h3>
      {recipe.author && <span className="recipe-author">by {recipe.author}</span>}
      {recipe.tags && (
        <div className="recipe-tags">
          {recipe.tags.map((tag) => (
            <span className="recipe-tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  </Link>
);

export default RecipeCard;
