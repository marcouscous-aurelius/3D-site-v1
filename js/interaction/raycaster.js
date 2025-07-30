import * as THREE from 'three';
import { camera } from '../core/scene.js';

export const raycaster = new THREE.Raycaster();
raycaster.params.Mesh.threshold = 0;

export const pointer = new THREE.Vector2();
export const pointerPixel = { x: -10000, y: -10000 };

// Track pointer movement for raycasting
window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    pointerPixel.x = event.clientX;
    pointerPixel.y = event.clientY;
});

export function updateRaycaster() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster;
}
