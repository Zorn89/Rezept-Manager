


import React, { useState } from 'react';
import AddRecipeForm from './components/AddRecipeForm';
import RecipeList from './components/RecipeList';

/**
 * Die Hauptkomponente der Anwendung. 
 * Sie verwaltet den Hauptzustand und koordiniert die Interaktion
 * zwischen dem Formular (Erstellen) und der Liste (Anzeigen).
 */
function App() {
    // Dieser State-Wert (updateKey) dient dazu, die RecipeList 
    // zu zwingen, sich neu zu laden (neuer GET-Request),
    // sobald ein neues Rezept erfolgreich hinzugefügt wurde.
    const [updateKey, setUpdateKey] = useState(0);

    /**
     * Wird von der AddRecipeForm aufgerufen, wenn ein POST-Request erfolgreich war.
     * @param {object} newRecipe - Das vom Backend zurückgegebene neue Rezeptobjekt.
     */
    const handleRecipeAdded = (newRecipe) => {
        // Optionale Benachrichtigung
        console.log(`Rezept "${newRecipe.titel}" erfolgreich erstellt!`);
        
        // Den Schlüssel erhöhen, um die RecipeList Komponente neu zu mounten/aktualisieren.
        setUpdateKey(prevKey => prevKey + 1); 
    };

    return (
        <div className="App" style={appContainerStyle}>
            <h1>👩‍🍳 Mein Digitales Rezeptbuch API</h1>
            
            {/* 1. Komponente zur Eingabe neuer Rezepte */}
            <AddRecipeForm onRecipeAdded={handleRecipeAdded} />
            
            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />
            
            {/* 2. Komponente zur Anzeige aller Rezepte */}
            {/* Der 'key' zwingt React, die Komponente bei jeder Änderung von 'updateKey' neu zu initialisieren, 
                was fetchRecipes in RecipeList erneut auslöst. */}
            <RecipeList key={updateKey} />
        </div>
    );
}

// Einfache Styling-Objekte
const appContainerStyle = {
    maxWidth: '800px', 
    margin: '0 auto', 
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
};

export default App;