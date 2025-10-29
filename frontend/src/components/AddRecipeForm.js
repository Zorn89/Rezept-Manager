import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/recipes';

const AddRecipeForm = ({ onRecipeAdded }) => {
    const [titel, setTitel] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [zutaten, setZutaten] = useState(''); // Eingabe als kommaseparierter String
    const [anweisungen, setAnweisungen] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Zutaten-String in ein Array umwandeln und trimmen
        const zutatenArray = zutaten.split(',').map(item => item.trim()).filter(item => item !== '');
        
        const newRecipe = {
            titel,
            beschreibung,
            zutaten: zutatenArray,
            anweisungen
        };

        try {
            // 🚀 API-Integration: POST-Anfrage
            const response = await axios.post(API_URL, newRecipe);
            
            // Elternkomponente informieren und Formular zurücksetzen
            onRecipeAdded(response.data); 
            setTitel('');
            setBeschreibung('');
            setZutaten('');
            setAnweisungen('');

        } catch (err) {
            console.error("Fehler beim Erstellen des Rezepts:", err);
            setError('Fehler beim Speichern des Rezepts. Bitte versuche es erneut.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Neues Rezept hinzufügen</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Titel" 
                    value={titel} 
                    onChange={(e) => setTitel(e.target.value)} 
                    required 
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <textarea 
                    placeholder="Beschreibung" 
                    value={beschreibung} 
                    onChange={(e) => setBeschreibung(e.target.value)}
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <input 
                    type="text" 
                    placeholder="Zutaten (kommasepariert, z.B. Mehl, Zucker, Eier)" 
                    value={zutaten} 
                    onChange={(e) => setZutaten(e.target.value)}
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <textarea 
                    placeholder="Anweisungen" 
                    value={anweisungen} 
                    onChange={(e) => setAnweisungen(e.target.value)}
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Wird gespeichert...' : 'Rezept speichern'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default AddRecipeForm;