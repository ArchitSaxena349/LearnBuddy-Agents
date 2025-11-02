import { useState } from 'react';
import { motion } from 'framer-motion';
import ModelViewer from './3dmodes';
import ARViewer from './ARViewer';
import ARPromptInput from './ARPromptInput';

const models = [
  {
    id: 1,
    title: 'Human Heart',
    description: '3D animated realistic human heart model',
    embedUrl: 'https://sketchfab.com/models/a70c0c47fe4b4bbfabfc8f445365d5a4/embed'
  },
  {
    id: 3,
    title: 'Muscles and Bones Anatomy',
    description: '3D animated muscles and bones anatomy body model',
    embedUrl: 'https://sketchfab.com/models/db7be21587804a32ab3a99e165c56e19/embed'
  },
  {
    id: 4,
    title: 'Benzene, C6H6',
    description: 'Benzene, C6H6, is a planar molecule containing a ring of six carbon atoms, each with a hydrogen atom attached',
    embedUrl: 'https://sketchfab.com/models/7fc04cef71174d93893db16e364768f5/embed'
  }
];

export default function VisualizationGrid() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [arModelUrl, setArModelUrl] = useState(null);
  const [arPrompt, setArPrompt] = useState(null);
  const [isLoadingAR, setIsLoadingAR] = useState(false);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'ar'

  const handleModelLoaded = (modelUrl, prompt) => {
    setArModelUrl(modelUrl);
    setArPrompt(prompt);
    setViewMode('ar');
  };

  const closeARViewer = () => {
    setArModelUrl(null);
    setArPrompt(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => {
            setViewMode('gallery');
            closeARViewer();
          }}
          className={`px-6 py-3 font-medium transition-colors ${
            viewMode === 'gallery'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Gallery Models
        </button>
        <button
          onClick={() => setViewMode('ar')}
          className={`px-6 py-3 font-medium transition-colors ${
            viewMode === 'ar'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          AI Generator
        </button>
      </div>

      {/* AI Generator View */}
      {viewMode === 'ar' && (
        <div>
          <ARPromptInput
            onModelLoaded={handleModelLoaded}
            isLoading={isLoadingAR}
            setIsLoading={setIsLoadingAR}
          />

          {arModelUrl && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <ARViewer
                modelUrl={arModelUrl}
                onClose={closeARViewer}
                prompt={arPrompt}
              />
            </div>
          )}

          {!arModelUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800">
                💡 Enter a prompt above to generate a 3D model using AI. The model will appear here once generated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pre-defined 3D Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{model.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{model.description}</p>
                  <button
                    onClick={() => setSelectedModel(model)}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Visualize
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Sketchfab Models */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg w-full max-w-4xl p-6"
          >
            <ModelViewer embedUrl={selectedModel.embedUrl} onClose={() => setSelectedModel(null)} />
            <button
              onClick={() => setSelectedModel(null)}
              className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
