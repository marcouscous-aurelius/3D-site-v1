import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { ObjectPool } from '../utils/ObjectPool.js';

class CubeLightingManager {
    constructor() {
        this.emissiveMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        
        this.originalMaterials = new Map();
        this.activeCubes = new Set();
        this.pointLights = new ObjectPool(() => {
            const light = new THREE.PointLight(0x00ff00, 1, 20);
            light.intensity = 0.8;
            return light;
        }, 20); // Pre-allocate 20 lights
        
        this.activePointLights = new Map();
        this.lightCounter = 0;
    }

    // Check if a cube should be activated based on its neighbors
    shouldActivate(cube, neighbors) {
        const position = cube.position;
        return neighbors.some(neighbor => {
            if (!neighbor) return false;
            const distance = position.distanceTo(neighbor.position);
            return distance <= 1.5; // Activate when cubes are close
        });
    }

    // Activate a cube's emissive material
    activateCube(cube) {
        if (this.activeCubes.has(cube)) return;
        
        // Store original material
        if (!this.originalMaterials.has(cube)) {
            this.originalMaterials.set(cube, cube.material);
        }
        
        cube.material = this.emissiveMaterial;
        this.activeCubes.add(cube);
        
        // Add point light for every 4th cube
        this.lightCounter++;
        if (this.lightCounter % 4 === 0) {
            const light = this.pointLights.acquire();
            light.position.copy(cube.position);
            scene.add(light);
            this.activePointLights.set(cube, light);
        }
    }

    // Deactivate a cube's emissive material
    deactivateCube(cube) {
        if (!this.activeCubes.has(cube)) return;
        
        cube.material = this.originalMaterials.get(cube);
        this.activeCubes.delete(cube);
        
        // Remove point light if it exists
        if (this.activePointLights.has(cube)) {
            const light = this.activePointLights.get(cube);
            scene.remove(light);
            this.pointLights.release(light);
            this.activePointLights.delete(cube);
        }
    }

    // Update lighting based on cube positions
    update(cubes, getNeighbors) {
        cubes.forEach(cube => {
            const neighbors = getNeighbors(cube);
            if (this.shouldActivate(cube, neighbors)) {
                this.activateCube(cube);
            } else {
                this.deactivateCube(cube);
            }
        });
    }

    // Settings methods
    setEmissiveColor(color) {
        this.emissiveMaterial.emissive.setHex(color);
        this.pointLights.getAll().forEach(light => {
            light.color.setHex(color);
        });
    }

    setEmissiveIntensity(intensity) {
        this.emissiveMaterial.emissiveIntensity = intensity;
    }

    setLightIntensity(intensity) {
        this.pointLights.getAll().forEach(light => {
            light.intensity = intensity;
        });
    }
}

export const cubeLightingManager = new CubeLightingManager();
