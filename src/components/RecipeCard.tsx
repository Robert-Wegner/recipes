import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

const BACKEND_URL = "https://recipes-4p09.onrender.com";
const ACCESS_TOKEN = "secretToken";

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeCopied?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRecipeCopied }) => {
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/recipes/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recipe.id, accessToken: ACCESS_TOKEN })
      });
      if (!res.ok) throw new Error('Copy failed');
      await res.json();
      if (onRecipeCopied) onRecipeCopied();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="recipe-card-wrapper" style={{ position: 'relative' }}>
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
      <button 
        onClick={handleCopy} 
        style={{ position: 'absolute', top: '5px', right: '5px' }}
      >
        Copy
      </button>
    </div>
  );
};

export default RecipeCard;
