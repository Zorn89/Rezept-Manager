import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/recipes';

// Erlaubt das Hinzufügen von Leerzeilen im Textbereich
const formatTextForDisplay = (text) => {
    return text ? text.split('\n').map((line, index) => <p key={index} style={{ margin: '0 0 8px 0' }}>{line}</p>) : null;
};

const RecipeCard = ({ recipe, onActionCompleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ 
        titel: recipe.titel, 
        beschreibung: recipe.beschreibung, 
        // Array von Zutaten in kommaseparierten String für das Formular umwandeln
        zutaten: Array.isArray(recipe.zutaten) ? recipe.zutaten.join(', ') : '', 
        anweisungen: recipe.anweisungen 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    /**
     * ✏️ Update-Logik (PUT)
     */
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Bereite die Daten für das Backend vor
        const updatedRecipe = {
            ...editData,
            // Zutaten-String in Array umwandeln
            zutaten: editData.zutaten.split(',').map(item => item.trim()).filter(item => item !== '')
        };

        try {
            // 🚀 API-Integration: PUT-Anfrage
            await axios.put(`${API_URL}/${recipe.id}`, updatedRecipe);
            
            setIsEditing(false);
            alert(`Rezept "${updatedRecipe.titel}" erfolgreich aktualisiert.`);
            
            // Elternkomponente (RecipeList) benachrichtigen, dass die Liste neu geladen werden muss
            onActionCompleted(); 
            
        } catch (err) {
            console.error("Fehler beim Aktualisieren:", err);
            setError('Fehler beim Aktualisieren des Rezepts.');
        } finally {
            setLoading(false);
        }
    };
    
    /**
     * 🗑️ Delete-Logik
     */
    const handleDelete = async () => {
        if (!window.confirm(`Soll das Rezept "${recipe.titel}" wirklich gelöscht werden?`)) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 🚀 API-Integration: DELETE-Anfrage
            await axios.delete(`${API_URL}/${recipe.id}`);

            alert(`Rezept "${recipe.titel}" wurde gelöscht.`);
            // Elternkomponente benachrichtigen, um das gelöschte Element aus der Liste zu entfernen
            onActionCompleted(); 

        } catch (err) {
            console.error("Fehler beim Löschen:", err);
            setError('Fehler beim Löschen des Rezepts.');
        } finally {
            setLoading(false);
        }
    };
    
    // ----------------------------------------------------
    // RENDERING DES BEARBEITUNGSFORMULARS
    // ----------------------------------------------------
    if (isEditing) {
        return (
            <div style={cardStyle}>
                <form onSubmit={handleUpdate}>
                    <h4 style={{marginTop: 0}}>Rezept bearbeiten (ID: {recipe.id})</h4>
                    <input 
                        type="text" 
                        name="titel" 
                        value={editData.titel} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle}
                    />
                    <textarea 
                        name="beschreibung" 
                        value={editData.beschreibung} 
                        onChange={handleChange}
                        style={textareaStyle}
                    />
                    <input 
                        type="text" 
                        name="zutaten" 
                        placeholder="Zutaten (kommasepariert)"
                        value={editData.zutaten} 
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <textarea 
                        name="anweisungen" 
                        value={editData.anweisungen} 
                        onChange={handleChange}
                        style={textareaStyle}
                    />
                    <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                        {loading ? 'Wird gespeichert...' : 'Speichern'}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} disabled={loading}>
                        Abbrechen
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        );
    }
    
    // ----------------------------------------------------
    // RENDERING DER ANZEIGEKARTE
    // ----------------------------------------------------
    return (
        <div style={cardStyle}>
            <h4 style={{marginTop: 0}}>{recipe.titel} (ID: {recipe.id})</h4>
            <p><strong>Beschreibung:</strong> {formatTextForDisplay(recipe.beschreibung)}</p>
            
            <h5 style={{marginBottom: '5px'}}>Zutaten:</h5>
            {Array.isArray(recipe.zutaten) && recipe.zutaten.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0' }}>
                    {recipe.zutaten.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>Keine Zutaten angegeben.</p>
            )}

            <h5 style={{marginBottom: '5px'}}>Anweisungen:</h5>
            {formatTextForDisplay(recipe.anweisungen)}

            <div style={{ marginTop: '15px' }}>
                <button 
                    onClick={() => setIsEditing(true)} 
                    disabled={loading} 
                    style={{ marginRight: '10px' }}
                >
                    Bearbeiten
                </button>
                <button 
                    onClick={handleDelete} 
                    disabled={loading} 
                    style={{ backgroundColor: 'red', color: 'white' }}
                >
                    {loading ? 'Löschen...' : 'Löschen'}
                </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RecipeCard;

// Lokale Styles für Übersichtlichkeit
const cardStyle = {
    border: '1px solid #eee', 
    padding: '15px', 
    margin: '15px 0', 
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
};

const inputStyle = {
    display: 'block', 
    margin: '10px 0', 
    padding: '8px', 
    width: '95%'
};

const textareaStyle = {
    display: 'block', 
    margin: '10px 0', 
    padding: '8px', 
    width: '95%',
    minHeight: '80px'
};