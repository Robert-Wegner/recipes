import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/data/recipes.json')
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase()) ||
    recipe.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container">
      <h1 className="main-title">Delicious Recipes</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="recipe-grid">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Home;
