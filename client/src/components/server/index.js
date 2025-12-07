// Environment variables load karna
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY;

// Check for API Key
if (!API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set. Render Env Vars use karein.");
    // Hum sirf production mein crash nahi karenge taake static files serve ho sakein
}

// Gemini Client initialize karna
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * 🎨 Text-to-Image API Endpoint
 */
app.post('/api/generate-image', async (req, res) => {
    const { prompt } = req.body;

    if (!ai) {
        return res.status(503).json({ success: false, message: 'Server configuration error: API Key missing.' });
    }

    if (!prompt) {
        return res.status(400).json({ success: false, message: 'Prompt likhna zaroori hai.' });
    }

    try {
        console.log(`Generating image for prompt: ${prompt}`);
        
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002', 
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            }
        });

        const imageUrl = response.generatedImages[0].image.imageUri;
        
        res.json({
            success: true,
            imageUrl: imageUrl,
            prompt: prompt
        });

    } catch (error) {
        console.error('Gemini Image Generation Error:', error.message);
        res.status(500).json({ success: false, message: 'Image generate karne mein ghalti ho gayi. Shayad prompt unsafe hai ya API limit poori ho gayi hai.' });
    }
});

// Render Deployment ke liye Static Assets serve karna
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server ${PORT} port par chal raha hai.`);
});
