import * as THREE from 'https://esm.sh/three@0.162.0';
import { GLTFLoader } from 'https://esm.sh/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'https://esm.sh/three@0.162.0/examples/jsm/webxr/ARButton.js';


let camera, scene, renderer;
let loader = new GLTFLoader();

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer));

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const promptBox = document.getElementById('promptBox');
  promptBox.addEventListener('change', async () => {
    const text = promptBox.value;
    promptBox.value = '';
    await handleUserPrompt(text);
  });
}

async function handleUserPrompt(text) {
  console.log("User prompt:", text);
  const response = await fetch('/api/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text })
  });
  const result = await response.json();
  const modelUrl = result.modelUrl;

  loader.load(modelUrl, (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(0, 0, -0.5);
    scene.add(model);
  });
}

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
async function startVirtualLab(prompt) {
  const resp = await fetch('/api/virtual-lab', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({prompt})
  });
  const { lab, modelUrl } = await resp.json();

  // load all models (simplified: single model)
  loader.load(modelUrl, gltf => {
    const model = gltf.scene;
    model.name = lab.title;
    model.scale.set(0.2,0.2,0.2);
    model.position.set(0, -0.2, -0.5);
    scene.add(model);
    showLabUI(lab, model);
  });
}

function showLabUI(lab, model) {
  // create DOM overlay with steps, next/prev, param sliders
  // simple example: create slider for each parameter
  lab.parameters.forEach(p => {
    const slider = document.createElement('input');
    slider.type='range'; slider.min=p.min; slider.max=p.max; slider.value=p.default;
    slider.oninput = (e) => onParamChange(p.name, e.target.value, model);
    document.body.appendChild(slider);
  });

  // a 'Run Step' button to run the current step's action
  // implement handlers for actions like animate_fill, place_model, rotate, etc.
}

function onParamChange(name, value, model) {
  if (name === 'volume_ml') {
    // example: scale a liquid mesh's y scale to represent volume
    const liquid = model.getObjectByName('liquid');
    if (liquid) liquid.scale.y = value / 100;
  }
}
