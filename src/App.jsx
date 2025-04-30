import { useState } from 'react';
import './App.css';

function App() {
  const [subject, setSubject] = useState('');
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);
    setImgUrl(null);

    try {
      const formData = new FormData();
      formData.append('subject', subject);

      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        body: formData,
      });

      const html = await response.text();
      const imgRegex = /<img.*?src="([^"]*)"/;
      const match = html.match(imgRegex);
      if (match && match[1]) {
        setImgUrl(match[1]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="overlay"></div>

      <div className="content">
        <h1>🎨 Pixel Art Generator</h1>
        <form onSubmit={handleGenerate}>
          <input
            type="text"
            placeholder="Describe your character (e.g., alien commando)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {imgUrl && (
          <div className="image-container">
            <img src={imgUrl} alt="Generated Sprite" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
