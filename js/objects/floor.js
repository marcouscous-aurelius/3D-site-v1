import * as THREE from 'three';
import { scene } from '../core/scene.js';

// Floor creation
const floorGeometry = new THREE.PlaneGeometry(46, 46);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.1,
    envMapIntensity: 0.5
});

export const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid helper
export const gridHelper = new THREE.GridHelper(46, 46, 0xcccccc, 0xdddddd);
gridHelper.position.y = 0.01;
scene.add(gridHelper);
