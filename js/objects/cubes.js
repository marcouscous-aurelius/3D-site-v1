import * as THREE from 'three';
import { scene } from '../core/scene.js';

export const cubeGroup = new THREE.Group();
export const hitboxGroup = new THREE.Group();
scene.add(hitboxGroup);

const smallCubeGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
const smallCubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5
});

export const originalPositions = new Map();

export const ANIMATION_CONFIG = {
    moveDistance: 2,
    colorDarkness: 0.0
};

export const gridSize = 6;
export const gridCenterOffset = (gridSize - 1) / 2;

// Create cube grid
for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
            const cube = new THREE.Mesh(smallCubeGeometry, smallCubeMaterial.clone());
            const xPos = (x - gridCenterOffset);
            const yPos = y + 0.5;
            const zPos = (z - gridCenterOffset);
            cube.position.set(xPos, yPos, zPos);
            cube.castShadow = true;
            cube.receiveShadow = true;
            originalPositions.set(cube, cube.position.clone());
            cube.gridPosition = { x, y, z };
            cubeGroup.add(cube);

            // Create invisible hitbox
            const hitbox = new THREE.Mesh(
                smallCubeGeometry,
                new THREE.MeshBasicMaterial({ visible: false })
            );
            hitbox.position.copy(cube.position);
            hitbox.userData.visualCube = cube;
            hitboxGroup.add(hitbox);
        }
    }
}

scene.add(cubeGroup);

// Helper function to check neighbors
export function hasNeighbor(cube, dx, dy, dz) {
    const { x, y, z } = cube.gridPosition;
    const newX = x + dx;
    const newY = y + dy;
    const newZ = z + dz;
    return cubeGroup.children.some(c => 
        c.gridPosition.x === newX &&
        c.gridPosition.y === newY &&
        c.gridPosition.z === newZ
    );
}
