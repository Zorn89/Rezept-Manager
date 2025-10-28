// backend/index.js

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware, um JSON-Anfragen zu parsen
app.use(express.json());

// ------------------------------------
// 🔗 Verbindung zur lokalen PostgreSQL-DB
// ------------------------------------
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Testen der DB-Verbindung beim Start (optional)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Fehler beim Herstellen der DB-Verbindung', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Fehler bei der Testabfrage', err.stack);
        }
        console.log(`✅ Erfolgreich mit PostgreSQL verbunden. Aktuelle Zeit: ${result.rows[0].now}`);
    });
});


// ------------------------------------
// 🚀 REST-Endpunkte (CRUD)
// ------------------------------------
const API_PREFIX = '/api/recipes';


/**
 * 📝 POST /api/recipes: Neues Rezept erstellen
 */
app.post(API_PREFIX, async (req, res) => {
    const { titel, beschreibung, zutaten, anweisungen } = req.body;

    // Einfache Validierung
    if (!titel) {
        return res.status(400).json({ error: 'Der Titel des Rezepts ist erforderlich.' });
    }

    try {
        const query = `
            INSERT INTO rezepte (titel, beschreibung, zutaten, anweisungen)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [titel, beschreibung, zutaten, anweisungen];
        const result = await pool.query(query, values);

        // Das erstellte Rezept zurückgeben
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Fehler beim Erstellen des Rezepts:', err.message);
        res.status(500).json({ error: 'Interner Serverfehler beim Erstellen des Rezepts.' });
    }
});


/**
 * 📚 GET /api/recipes: Alle Rezepte abrufen
 */
app.get(API_PREFIX, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rezepte ORDER BY id ASC;');
        res.json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen aller Rezepte:', err.message);
        res.status(500).json({ error: 'Interner Serverfehler beim Abrufen der Rezepte.' });
    }
});


/**
 * 🔍 GET /api/recipes/:id: Ein einzelnes Rezept abrufen
 */
app.get(`${API_PREFIX}/:id`, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM rezepte WHERE id = $1;', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Rezept mit ID ${id} nicht gefunden.` });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Fehler beim Abrufen des Rezepts mit ID ${id}:`, err.message);
        res.status(500).json({ error: 'Interner Serverfehler beim Abrufen des Rezepts.' });
    }
});

// TODO: Sie können hier die Endpunkte PUT/PATCH (Update) und DELETE (Löschen) hinzufügen.


// ------------------------------------
// 👂 Server starten
// ------------------------------------
app.listen(port, () => {
    console.log(`🚀 Backend-API läuft auf http://localhost:${port}`);
    console.log(`API-Endpunkte: ${API_PREFIX}`);
});