import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';

const API_URL = 'http://localhost:3000/api/recipes';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Zustand für manuelles Neuladen

    // 🔄 Funktion zum Abrufen der Rezepte
    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setRecipes(response.data);
            setError(null);
        } catch (err) {
            console.error("Fehler beim Abrufen der Rezepte:", err);
            setError('Fehler beim Laden der Rezepte.');
            setRecipes([]); // Setze auf leeres Array bei Fehler
        } finally {
            setLoading(false);
        }
    };

    // Funktion, die von RecipeCard aufgerufen wird, um die Liste neu zu laden
    const handleActionCompleted = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Führt die Abfrage einmal beim Laden der Komponente aus oder wenn ein Refresh ausgelöst wird
    useEffect(() => {
        fetchRecipes();
    }, [refreshTrigger]);

    if (loading) return <p>Rezepte werden geladen...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (recipes.length === 0) return <p>Noch keine Rezepte vorhanden. Füge eines hinzu!</p>;

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Alle Rezepte</h2>
            {recipes.map(recipe => (
                // 💡 Wichtig: Wir übergeben die Aktualisierungsfunktion (handleActionCompleted)
                <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onActionCompleted={handleActionCompleted} 
                />
            ))}
        </div>
    );
};

export default RecipeList;