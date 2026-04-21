const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Route racine - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
                            text: `Analysez cette image et listez les aliments visibles, puis générez 3 recettes. Répondez UNIQUEMENT en JSON: {"ingredients": [...], "recipes": [...]}`
                        }
                    ]
                })
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({ error: error.error?.message || 'Erreur API' });
        }

        const data = await response.json();
        const text = data.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            return res.status(400).json({ error: 'Format invalide' });
        }

        const result = JSON.parse(jsonMatch[0]);
        res.json({
            ingredients: result.ingredients || [],
            recipes: result.recipes || []
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
});
