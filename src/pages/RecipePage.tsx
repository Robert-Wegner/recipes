import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../types';
import '../styles/RecipeStyles.css';

const BACKEND_URL = "https://recipes-4p09.onrender.com";
const ACCESS_TOKEN = "secretToken";

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    if (id === "new") {
      const blankRecipe: Recipe = {
        id: "new",
        title: "",
        author: "",
        ingredients: [],
        instructions: [],
        prepTime: "",
        cookTime: "",
        servings: 0,
        remarks: "",
        tags: [],
      };
      setRecipe(blankRecipe);
      setEditMode(true);
    } else {
      fetch(`${BACKEND_URL}/recipes`)
        .then(res => res.json())
        .then((data: Recipe[]) => {
          const found = data.find(r => r.id === id) || null;
          setRecipe(found);
        })
        .catch(console.error);
    }
  }, [id]);

  if (!recipe) return <p className="container">Recipe not found.</p>;

  // Update field value
  const handleChange = (field: keyof Recipe, value: any) => {
    setRecipe({ ...recipe, [field]: value });
  };

  // List handling for ingredients, instructions, tags
  const handleListChange = (field: keyof Recipe, index: number, value: string) => {
    if (recipe) {
      const list = Array.isArray(recipe[field]) ? [...(recipe[field] as string[])] : [];
      list[index] = value;
      setRecipe({ ...recipe, [field]: list });
    }
  };

  const handleListAdd = (field: keyof Recipe) => {
    if (recipe) {
      const list = Array.isArray(recipe[field]) ? [...(recipe[field] as string[])] : [];
      list.push("");
      setRecipe({ ...recipe, [field]: list });
    }
  };

  const handleListDelete = (field: keyof Recipe, index: number) => {
    if (recipe) {
      const list = Array.isArray(recipe[field]) ? [...(recipe[field] as string[])] : [];
      list.splice(index, 1);
      setRecipe({ ...recipe, [field]: list });
    }
  };

  const handleListMove = (field: keyof Recipe, index: number, direction: 'up' | 'down') => {
    if (recipe) {
      const list = Array.isArray(recipe[field]) ? [...(recipe[field] as string[])] : [];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= list.length) return;
      [list[index], list[newIndex]] = [list[newIndex], list[index]];
      setRecipe({ ...recipe, [field]: list });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Save recipe (create new or update)
  const handleSave = async () => {
    if (!recipe) return;
    const formData = new FormData();
    const updatedRecipe = { ...recipe };
    if (updatedRecipe.id === "new") {
      updatedRecipe.id = Date.now().toString();
      updatedRecipe.dateCreated = new Date().toISOString();
    }
    formData.append('recipe', JSON.stringify(updatedRecipe));
    formData.append('accessToken', ACCESS_TOKEN);
    if (newImage) formData.append('image', newImage);
    try {
      const res = await fetch(`${BACKEND_URL}/recipes`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Save failed');
      const saved = await res.json();
      setRecipe(saved);
      setEditMode(false);
      setNewImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete recipe
  const handleDelete = async () => {
    if (!recipe) return;
    if (recipe.id === "new") {
      navigate('/');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/recipes/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recipe.id, accessToken: ACCESS_TOKEN })
      });
      if (!res.ok) throw new Error('Delete failed');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Link className="back-link" to="/">← Back to recipes</Link>
      {editMode ? (
        <div>
          <h1>Edit Recipe</h1>
          <div>
            <label>Title: </label>
            <input 
              type="text" 
              value={recipe.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
            />
          </div>
          <div>
            <label>Author: </label>
            <input 
              type="text" 
              value={recipe.author || ''} 
              onChange={(e) => handleChange('author', e.target.value)} 
            />
          </div>
          <div>
            <label>Prep Time: </label>
            <input 
              type="text" 
              value={recipe.prepTime || ''} 
              onChange={(e) => handleChange('prepTime', e.target.value)} 
            />
          </div>
          <div>
            <label>Cook Time: </label>
            <input 
              type="text" 
              value={recipe.cookTime || ''} 
              onChange={(e) => handleChange('cookTime', e.target.value)} 
            />
          </div>
          <div>
            <label>Servings: </label>
            <input 
              type="number" 
              value={recipe.servings || 0} 
              onChange={(e) => handleChange('servings', Number(e.target.value))} 
            />
          </div>
          <div>
            <label>Remarks: </label>
            <textarea 
              value={recipe.remarks || ''} 
              onChange={(e) => handleChange('remarks', e.target.value)} 
            />
          </div>
          <div>
            <label>Tags: </label>
            {recipe.tags && recipe.tags.map((tag, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={tag} 
                  onChange={(e) => handleListChange('tags', index, e.target.value)} 
                />
                <button onClick={() => handleListMove('tags', index, 'up')}>↑</button>
                <button onClick={() => handleListMove('tags', index, 'down')}>↓</button>
                <button onClick={() => handleListDelete('tags', index)}>Delete</button>
              </div>
            ))}
            <button onClick={() => handleListAdd('tags')}>Add Tag</button>
          </div>
          <div>
            <label>Ingredients: </label>
            {recipe.ingredients && recipe.ingredients.map((ing, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={ing} 
                  onChange={(e) => handleListChange('ingredients', index, e.target.value)} 
                />
                <button onClick={() => handleListMove('ingredients', index, 'up')}>↑</button>
                <button onClick={() => handleListMove('ingredients', index, 'down')}>↓</button>
                <button onClick={() => handleListDelete('ingredients', index)}>Delete</button>
              </div>
            ))}
            <button onClick={() => handleListAdd('ingredients')}>Add Ingredient</button>
          </div>
          <div>
            <label>Instructions: </label>
            {recipe.instructions && recipe.instructions.map((inst, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={inst} 
                  onChange={(e) => handleListChange('instructions', index, e.target.value)} 
                />
                <button onClick={() => handleListMove('instructions', index, 'up')}>↑</button>
                <button onClick={() => handleListMove('instructions', index, 'down')}>↓</button>
                <button onClick={() => handleListDelete('instructions', index)}>Delete</button>
              </div>
            ))}
            <button onClick={() => handleListAdd('instructions')}>Add Instruction</button>
          </div>
          <div>
            <label>Image: </label>
            {recipe.imageUrl && !newImage && (
              <div>
                <img src={recipe.imageUrl} alt={recipe.title} style={{ maxWidth: '200px' }} />
              </div>
            )}
            <input type="file" onChange={handleImageChange} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
            <button onClick={handleDelete} style={{ marginLeft: '1rem', color: 'red' }}>
              Delete Recipe
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>{recipe.title}</h1>
          {recipe.imageUrl && (
            <img src={recipe.imageUrl} alt={recipe.title} className="detail-img" />
          )}
          {recipe.author && <p className="detail-author">by {recipe.author}</p>}
          {recipe.dateCreated && (
            <time className="detail-date">
              {new Date(recipe.dateCreated).toLocaleDateString()}
            </time>
          )}
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
          <button onClick={() => setEditMode(true)}>Edit Recipe</button>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
