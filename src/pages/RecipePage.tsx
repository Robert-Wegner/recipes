import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch('/data/recipes.json')
      .then(res => res.json())
      .then((data: Recipe[]) => setRecipe(data.find(r => r.id === id) || null))
      .catch(console.error);
  }, [id]);

  if (!recipe) return <p className="container">Recipe not found.</p>;

  return (
    <div className="container">
      <Link className="back-link" to="/">← Back to recipes</Link>
      <RecipeDetail recipe={recipe} />
    </div>
  );
};

export default RecipePage;
