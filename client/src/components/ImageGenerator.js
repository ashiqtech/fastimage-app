import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet'; 
import './ImageGenerator.css'; 

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt likhna zaroori hai.');
      return;
    }

    setLoading(true);
    setImageUrl('');
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-image`, { prompt });
      
      setImageUrl(response.data.imageUrl);
      setError('');
    } catch (err) {
      setError('Image generate nahi ho saki. Server ya API mein ghalti hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Helmet> 
        <title>FastImage - Text-to-Image AI App 2026 New AI App</title>
        <meta name="description" content="FastImage: Google Gemini ki taaqat se high-quality images generate karein. Text-to-Image 2026 new AI app. Free, fresh UI, aur tez." />
      </Helmet>
      
      <header className="main-header">
        <div className="logo-container">
          <span className="logo-icon">✨</span>
          <h1 className="logo-text">FastImage</h1>
        </div>
        <p className="slogan">Text-to-Image: 2026 New AI App</p>
      </header>
      
      <main className="main-content">
        <form onSubmit={generateImage} className="prompt-form">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Apna prompt yahan likhein (maslan: 'A futuristic city skyline with flying cars, highly detailed, cinematic lighting')."
            rows="3"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="generate-button">
            {loading ? 'Generating...' : 'Generate Fast Image'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        
        <div className="image-result-area">
          <h3>Your AI-Generated Image</h3>
          
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>AI aapki tasveer bana raha hai...</p>
            </div>
          )}

          {imageUrl && !loading && (
            <div className="generated-image-container">
              <img src={imageUrl} alt={prompt || 'AI Generated Image'} className="generated-image" />
              <p className="prompt-display">Prompt: *{prompt}*</p>
            </div>
          )}

          {!imageUrl && !loading && !error && (
            <div className="placeholder-box">
                <span className="placeholder-icon">🎨</span>
                <p>Prompt likhein aur apni pehli tasveer banayein.</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} FastImage. Powered by Google Gemini AI.</p>
      </footer>
    </div>
  );
};

export default ImageGenerator;
