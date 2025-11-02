import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// GLTF Model Loader Component using GLTFLoader for explicit error handling
function Model({ url, scale = 1, onError, onLoaded }) {
  const [model, setModel] = useState(null);
  const modelRef = useRef();

  useEffect(() => {
    if (!url) return;
    let isMounted = true;
    const loader = new GLTFLoader();

    const modelUrl = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;

    loader.load(
      modelUrl,
      (gltf) => {
        if (!isMounted) return;

        try {
          // Traverse and set up shadows/materials
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.transparent = child.material.transparent || false;
                child.material.opacity = child.material.opacity ?? 1.0;
              }
            }
          });

          // Center the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.x = -center.x;
          gltf.scene.position.y = -center.y;
          gltf.scene.position.z = -center.z;

          setModel(gltf.scene);
          if (onLoaded) onLoaded();
        } catch (err) {
          console.error('Error processing GLTF:', err);
          if (onError) onError(new Error('Failed to process 3D model.'));
        }
      },
      undefined,
      (err) => {
        console.error('GLTFLoader error:', err);
        if (onError) onError(new Error('Failed to load 3D model. Please try again.'));
      }
    );

    return () => {
      isMounted = false;
      // dispose if needed
      if (model) {
        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose?.();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose && m.dispose());
            } else {
              child.material?.dispose?.();
            }
          }
        });
      }
    };
  }, [url]);

  if (!model) return null;

  return <primitive ref={modelRef} object={model} scale={scale} />;
}

// Main AR Viewer Component
export default function ARViewer({ modelUrl, onClose, prompt }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    // Reset states when modelUrl changes — actual loading handled in Model via GLTFLoader
    if (modelUrl) {
      setIsLoading(true);
      setError(null);
      setModelLoaded(false);
    }
  }, [modelUrl]);

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white rounded-lg w-full max-w-4xl overflow-hidden"
      ref={containerRef}
    >
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {/* Loading State */}
        {(isLoading || !modelLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
            <div className="text-white text-center p-6 rounded-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Generating Your 3D Model</h3>
              <p className="text-gray-300 max-w-md">
                {isLoading ? (
                  'Preparing the AI model...'
                ) : (
                  'Loading the 3D model. This may take a moment...'
                )}
              </p>
              {!isLoading && !modelLoaded && (
                <p className="text-sm text-gray-400 mt-2">
                  If this takes too long, try refreshing the page or generating a new model.
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-10">
            <div className="bg-red-900/80 text-white p-6 rounded-lg max-w-md text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Error Loading Model</h3>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-red-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* 3D Canvas */}
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          className={`transition-opacity duration-500 ${!modelLoaded ? 'opacity-0' : 'opacity-100'}`}
        >
          <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
          
          {/* Lights */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Grid Helper */}
          <gridHelper args={[10, 10, 0x444444, 0x888888]} rotation={[Math.PI / 2, 0, 0]} />
          
          {/* 3D Model */}
          {modelUrl && (
            <group>
              <Model 
                url={modelUrl}
                scale={1}
                onError={(err) => {
                  setError(err.message || 'Failed to load the 3D model');
                  setIsLoading(false);
                  setModelLoaded(false);
                }}
              />
              
              {/* Center point for better orientation */}
              <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.5, 32]} />
                <meshBasicMaterial color="red" transparent opacity={0.5} />
              </mesh>
            </group>
          )}
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
            autoRotate={!isLoading && modelLoaded}
            autoRotateSpeed={0.5}
          />
          
          {/* Environment */}
          <Environment preset="city" />
        </Canvas>
      </div>

      {prompt && (
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Prompt:</span> {prompt}
          </p>
        </div>
      )}

      <div className="p-4 flex justify-between items-center bg-gray-50 border-t">
        <a
          href={modelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          View Model Source
        </a>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}


