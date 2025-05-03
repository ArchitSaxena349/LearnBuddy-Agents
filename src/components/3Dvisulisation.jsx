import { useState } from 'react';
import { motion } from 'framer-motion';
import ModelViewer from './3dmodes';

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

  return (
    <div className="container mx-auto px-4 py-8">
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

      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6">
            <ModelViewer embedUrl={selectedModel.embedUrl} />
            <button
              onClick={() => setSelectedModel(null)}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}