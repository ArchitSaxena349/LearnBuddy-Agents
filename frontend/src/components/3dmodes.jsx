import { motion } from 'framer-motion';

export default function ModelViewer({ embedUrl, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="sketchfab-embed-wrapper w-full aspect-video">
        <iframe
          title="3D Model Viewer"
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allowFullScreen
          mozAllowFullScreen
          webkitAllowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src={embedUrl}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>
          <a
            href={embedUrl.replace('/embed', '')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700"
          >
            View on Sketchfab
          </a>
        </p>
      </div>

      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 bg-gray-600 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
      >
        ✕
      </button>
    </motion.div>
  );
}