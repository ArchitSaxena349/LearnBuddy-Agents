import { useState } from 'react';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ARPromptInput({ onModelLoaded, isLoading, setIsLoading }) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/ar/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate model');
      }

      const data = await response.json();
      
      if (data.modelUrl) {
        onModelLoaded(data.modelUrl, prompt);
        setPrompt('');
      } else {
        throw new Error('No model URL returned');
      }
    } catch (err) {
      console.error('Error generating model:', err);
      setError(err.message || 'Failed to generate 3D model. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Generate 3D Model with AI
      </h3>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to visualize (e.g., 'human heart', 'benzene molecule', 'anatomy model')..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate 3D Model'
          )}
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-500">
        💡 Tip: Be specific about what you want to see (e.g., "human heart anatomy" or "benzene molecular structure")
      </p>
    </motion.div>
  );
}

