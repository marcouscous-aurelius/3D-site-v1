import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera, renderer } from './scene.js';

// OrbitControls setup
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 8;
controls.maxDistance = 40;

// Touch controls configuration
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;

controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
};

// Fine-tuning controls
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 0.8;
controls.panSpeed = 0.8;
