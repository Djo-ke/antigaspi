const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour analyzer les images
app.post('/api/analyze', async (req, res) => {
    try {
        const { image, apiKey } = req.body;

        if (!image || !apiKey) {
            return res.status(400).json({ error: 'Image et clé API requises' });
        }

        if (!apiKey.startsWith('sk-ant-')) {
            return res.status(400).json({ error: 'Clé API invalide' });
        }

        // Appel à l'API Claude
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: image
                            }
                        },
                        {
                            type: 'text',
                            text: `Analysez cette image et:
1. Listez TOUS les aliments/ingrédients visibles (fruits, légumes, viandes, produits, etc)
2. Générez 3 recettes créatives réalistes et faciles avec ces ingrédients

Répondez UNIQUEMENT en JSON (pas de markdown, pas de code block):
{
  "ingredients": ["ingredient1", "ingredient2"],
  "recipes": [
    {
      "name": "Nom de recette",
      "description": "Description courte",
      "time": "15 min",
      "difficulty": "Facile",
      "servings": "2 pers.",
      "ingredients_needed": ["ingredient - quantité"],
      "steps": ["Étape 1", "Étape 2", "Étape 3"]
    }
  ]
}`
                        }
                    ]
                })
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API Error:', error);
            return res.status(response.status).json({ 
                error: error.error?.message || 'Erreur API Claude' 
            });
        }

        const data = await response.json();
        const text = data.content[0].text;
        
        // Parser la réponse JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(400).json({ error: 'Format de réponse invalide' });
        }

        const result = JSON.parse(jsonMatch[0]);

        res.json({
            ingredients: result.ingredients || [],
            recipes: result.recipes || []
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            error: error.message || 'Erreur serveur' 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Serveur Anti Gaspi démarré sur port ${PORT}`);
    console.log(`📱 URL: http://localhost:${PORT}`);
});
