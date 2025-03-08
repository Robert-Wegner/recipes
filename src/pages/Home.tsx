import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

const BACKEND_URL = "https://recipes-4p09.onrender.com";

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRecipes = () => {
    fetch(`${BACKEND_URL}/recipes`)
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase()) ||
    recipe.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddNew = () => {
    navigate('/recipe/new');
  };

  const handleRecipeCopied = () => {
    fetchRecipes();
  };

  return (
    <div className="container">
      <h1 className="main-title">Delicious Recipes</h1>
      <button onClick={handleAddNew}>Add New Recipe</button>
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="recipe-grid">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} onRecipeCopied={handleRecipeCopied} />
        ))}
      </div>
    </div>
  );
};

export default Home;
