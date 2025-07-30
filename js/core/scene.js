import * as THREE from 'three';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfafafa);

// Camera setup
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
export const cameraStartPosition = new THREE.Vector3(15, 12, 15);
camera.position.copy(cameraStartPosition);
camera.lookAt(0, 0, 0);

// Renderer setup
export const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#threejs-container'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
