const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { image, apiKey } = req.body;
    if (!image || !apiKey) return res.status(400).json({ error: 'Missing data' });

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
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: 'Detect food items and create 3 recipes. Reply ONLY in JSON: {"ingredients": [], "recipes": []}' }
          ]
        }]
      })
    });

    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    const json = data.content[0].text.match(/\{[\s\S]*\}/)[0];
    res.json(JSON.parse(json));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
