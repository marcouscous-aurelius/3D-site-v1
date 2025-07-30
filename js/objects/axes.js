import * as THREE from 'three';
import { scene } from '../core/scene.js';

function createAxisLabel(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = 128;
    canvas.width = size;
    canvas.height = size;

    context.font = `Bold 60px Arial`;
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, size / 2, size / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.17, 0.17, 0.17);
    sprite.position.copy(position);
    sprite.renderOrder = 999;
    return sprite;
}

export const gizmoGroup = new THREE.Group();
const axesHelper = new THREE.AxesHelper(0.66);
gizmoGroup.add(axesHelper);

gizmoGroup.add(createAxisLabel('X', new THREE.Vector3(0.85, 0, 0)));
gizmoGroup.add(createAxisLabel('Y', new THREE.Vector3(0, 0.85, 0)));
gizmoGroup.add(createAxisLabel('Z', new THREE.Vector3(0, 0, 0.85)));

gizmoGroup.position.set(6, 0.5, 0);
scene.add(gizmoGroup);
