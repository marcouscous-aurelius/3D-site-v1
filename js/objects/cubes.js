import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { cubeLightingManager } from './cubeLighting.js';

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

// Helper function to get cube position index
function getCubeIndex(position) {
    return {
        x: Math.round(position.x + gridCenterOffset),
        y: Math.round(position.y + gridCenterOffset),
        z: Math.round(position.z + gridCenterOffset)
    };
}

// Helper function to get neighboring cubes
function getNeighboringCubes(cube) {
    const pos = getCubeIndex(cube.position);
    const neighbors = [];
    
    // Check all 6 adjacent positions
    const directions = [
        { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
    ];
    
    for (const dir of directions) {
        const nx = pos.x + dir.x;
        const ny = pos.y + dir.y;
        const nz = pos.z + dir.z;
        
        // Skip if outside grid
        if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize || nz < 0 || nz >= gridSize) {
            continue;
        }
        
        // Find the cube at this position
        const neighbor = cubeGroup.children.find(c => {
            const nPos = getCubeIndex(c.position);
            return nPos.x === nx && nPos.y === ny && nPos.z === nz;
        });
        
        if (neighbor) {
            neighbors.push(neighbor);
        }
    }
    
    return neighbors;
}

// Function to update cube lighting
export function updateCubeLighting() {
    // Get only the outer layer cubes
    const outerLayerCubes = cubeGroup.children.filter(cube => {
        const pos = getCubeIndex(cube.position);
        return pos.x === 0 || pos.x === gridSize - 1 ||
               pos.y === 0 || pos.y === gridSize - 1 ||
               pos.z === 0 || pos.z === gridSize - 1;
    });

    // Get the second layer cubes
    const secondLayerCubes = cubeGroup.children.filter(cube => {
        const pos = getCubeIndex(cube.position);
        return (pos.x === 1 || pos.x === gridSize - 2) ||
               (pos.y === 1 || pos.y === gridSize - 2) ||
               (pos.z === 1 || pos.z === gridSize - 2);
    });

    // Update lighting for second layer cubes based on outer layer neighbors
    cubeLightingManager.update(secondLayerCubes, getNeighboringCubes);
}

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
