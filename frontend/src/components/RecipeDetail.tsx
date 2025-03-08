import React from 'react';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => (
  <article className="recipe-detail">
    {recipe.imageUrl && (
      <img src={recipe.imageUrl} alt={recipe.title} className="detail-img" />
    )}
    <header>
      <h1>{recipe.title}</h1>
      {recipe.author && <p className="detail-author">by {recipe.author}</p>}
      {recipe.dateCreated && (
        <time className="detail-date">
          {new Date(recipe.dateCreated).toLocaleDateString()}
        </time>
      )}
    </header>
    <section className="detail-info">
      {recipe.prepTime && <p><strong>Prep Time:</strong> {recipe.prepTime}</p>}
      {recipe.cookTime && <p><strong>Cook Time:</strong> {recipe.cookTime}</p>}
      {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
    </section>
    <section className="detail-section">
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </section>
    <section className="detail-section">
      <h2>Instructions</h2>
      <ol>
        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
    </section>
    {recipe.remarks && (
      <section className="detail-section">
        <h2>Remarks</h2>
        <p>{recipe.remarks}</p>
      </section>
    )}
    {recipe.referenceUrl && recipe.referenceUrl.length > 0 && (
      <section className="detail-section">
        <h2>References</h2>
        <ul>
          {recipe.referenceUrl.map((url, idx) => (
            <li key={idx}><a href={url}>{url}</a></li>
          ))}
        </ul>
      </section>
    )}
  </article>
);

export default RecipeDetail;
