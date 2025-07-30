import * as THREE from 'three';
import { ObjectPool } from './utils/ObjectPool.js';
import { FrustumCuller } from './utils/FrustumCuller.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';

export class SceneManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.objectPool = new ObjectPool();
        this.frustumCuller = new FrustumCuller(camera);
        this.performanceMonitor = new PerformanceMonitor();
        this.lastFrameTime = 0;
        this.deltaTime = 0;

        // Initialize instance rendering
        this.setupInstancedMeshes();
    }

    setupInstancedMeshes() {
        // Create instanced mesh for cubes
        const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.7,
            metalness: 0.1,
            transparent: true,
            opacity: 0.5
        });

        // Assuming maximum of 1000 instances
        this.instancedMesh = new THREE.InstancedMesh(geometry, material, 1000);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.instancedMesh);
    }

    update() {
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Update frustum culling
        this.frustumCuller.update();

        // Update performance monitoring
        this.performanceMonitor.update();
    }

    updateInstancedMesh(positions, count) {
        const matrix = new THREE.Matrix4();
        
        for (let i = 0; i < count; i++) {
            const position = positions[i];
            matrix.setPosition(position.x, position.y, position.z);
            this.instancedMesh.setMatrixAt(i, matrix);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.count = count;
    }

    // Frame-rate independent physics
    updatePhysics(object, config) {
        const { velocity, acceleration, mass } = config;
        
        // Update velocity: v = v0 + at
        velocity.x += acceleration.x * this.deltaTime;
        velocity.y += acceleration.y * this.deltaTime;
        velocity.z += acceleration.z * this.deltaTime;
        
        // Update position: p = p0 + vt
        object.position.x += velocity.x * this.deltaTime;
        object.position.y += velocity.y * this.deltaTime;
        object.position.z += velocity.z * this.deltaTime;
    }

    dispose() {
        // Clean up resources
        this.objectPool.clear();
        this.instancedMesh.geometry.dispose();
        this.instancedMesh.material.dispose();
    }
}
