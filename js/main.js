import { scene, camera, renderer, cameraStartPosition } from './core/scene.js';
import './core/lights.js';
import { controls } from './core/controls.js';
import './objects/floor.js';
import './objects/axes.js';
import { cubeGroup, hitboxGroup, originalPositions, ANIMATION_CONFIG, hasNeighbor, updateCubeLighting } from './objects/cubes.js';
import { mouse } from './interaction/mouse.js';
import { raycaster, pointer, pointerPixel, updateRaycaster } from './interaction/raycaster.js';
import { initializeToolbox } from './ui/toolbox.js';
import { loadSettingsV2, cubeBaseColor } from './ui/settings.js';
import './utils/physics.js';

// Initialize
document.documentElement.classList.add('js');
initializeToolbox();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update raycaster
    updateRaycaster();
    const intersects = raycaster.intersectObjects(hitboxGroup.children, false);
    const intersectedHitbox = intersects.length > 0 ? intersects[0].object : null;
    const intersectedCube = intersectedHitbox ? intersectedHitbox.userData.visualCube : null;

    // Update cubes
    cubeGroup.children.forEach(cube => {
        if (!cube.visible) return;
        const originalPos = originalPositions.get(cube);
        const center = new THREE.Vector3(0, (gridSize - 1) / 2 + 0.5, 0);
        const relativePos = new THREE.Vector3().subVectors(originalPos, center);
        const direction = new THREE.Vector3();

        if (cube.gridPosition.y === gridSize - 1 &&
            cube.gridPosition.x > 0 && cube.gridPosition.x < gridSize - 1 &&
            cube.gridPosition.z > 0 && cube.gridPosition.z < gridSize - 1) {
            direction.set(0, 1, 0);
        } else {
            if (Math.abs(relativePos.x) >= Math.abs(relativePos.z)) {
                direction.set(Math.sign(relativePos.x), 0, 0);
            } else {
                direction.set(0, 0, Math.sign(relativePos.z));
            }
        }

        const screenPos = originalPositions.get(cube).clone().project(camera);
        const cubeScreenX = (screenPos.x + 1) * 0.5 * window.innerWidth;
        const cubeScreenY = (-screenPos.y + 1) * 0.5 * window.innerHeight;
        const dx = cubeScreenX - pointerPixel.x;
        const dy = cubeScreenY - pointerPixel.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let influence = 0;
        if (window.splineController) {
            const normalizedDistance = Math.min(distance / influenceRadius, 1);
            influence = window.splineController.getFalloffValue(normalizedDistance);
        } else {
            influence = 1 - distance / influenceRadius;
            if (influence < 0) influence = 0;
        }

        if (influence > 0 && hasNeighbor(cube, direction.x, direction.y, direction.z)) {
            influence = 0;
        }

        const desiredTarget = originalPos.clone().addScaledVector(direction, ANIMATION_CONFIG.moveDistance * influence);
        cube.position.lerp(desiredTarget, 0.1);

        const colorIntensity = 1 - influence * (1 - ANIMATION_CONFIG.colorDarkness);
        cube.material.color.copy(cubeBaseColor).multiplyScalar(colorIntensity);
    });
    
    // Update camera
    const ease = 0.05;
    if (mouse.isInWindow) {
        mouse.x += (mouse.target.x - mouse.x) * ease;
        mouse.y += (mouse.target.y - mouse.y) * ease;
    } else {
        mouse.x += (0 - mouse.x) * ease;
        mouse.y += (0 - mouse.y) * ease;
    }
    
    const cameraOffset = {
        x: mouse.x * 0.83,
        y: -mouse.y * 0.5,
        z: -mouse.x * 0.5
    };
    
    camera.position.x = cameraStartPosition.x + cameraOffset.x;
    camera.position.y = cameraStartPosition.y + cameraOffset.y;
    camera.position.z = cameraStartPosition.z + cameraOffset.z;
    camera.lookAt(0, 0, 0);

    controls.update();
    updateCubeLighting(); // Update cube lighting effects
    renderer.render(scene, camera);
}

// Start animation
animate();

// Load settings
document.addEventListener('DOMContentLoaded', loadSettingsV2);
