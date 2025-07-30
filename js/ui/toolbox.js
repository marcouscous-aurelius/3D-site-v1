import { scene } from '../core/scene.js';
import { cubeGroup, hitboxGroup, gridSize } from '../objects/cubes.js';
import { cubeLightingManager } from '../objects/cubeLighting.js';

// DOM Elements
export const toolboxV2 = document.getElementById('toolbox-v2');
export const toolboxToggleBtn = document.getElementById('toolbox-toggle-btn');
export const toggleInnerCubesV2 = document.getElementById('toggleInnerCubes-v2');
export const influenceSliderV2 = document.getElementById('influenceSlider-v2');
export const influenceValueV2 = document.getElementById('influenceValue-v2');
export const toggleFogV2 = document.getElementById('toggleFog-v2');
export const fogNearSliderV2 = document.getElementById('fogNearSlider-v2');
export const fogNearValueV2 = document.getElementById('fogNearValue-v2');
export const fogFarSliderV2 = document.getElementById('fogFarSlider-v2');
export const fogFarValueV2 = document.getElementById('fogFarValue-v2');
export const fogColorPickerV2 = document.getElementById('fogColorPicker-v2');
export const bgColorPickerV2 = document.getElementById('bgColorPicker-v2');
export const cubeColorPickerV2 = document.getElementById('cubeColorPicker-v2');
export const cubeOpacitySliderV2 = document.getElementById('cubeOpacitySlider-v2');
export const cubeOpacityValueV2 = document.getElementById('cubeOpacityValue-v2');

// Cube Lighting Controls
export const emissiveColorPickerV2 = document.getElementById('emissiveColorPicker-v2');
export const emissiveIntensitySliderV2 = document.getElementById('emissiveIntensitySlider-v2');
export const emissiveIntensityValueV2 = document.getElementById('emissiveIntensityValue-v2');
export const lightIntensitySliderV2 = document.getElementById('lightIntensitySlider-v2');
export const lightIntensityValueV2 = document.getElementById('lightIntensityValue-v2');

// Initialize UI
export function initializeToolbox() {
    if (toolboxToggleBtn) {
        toolboxToggleBtn.addEventListener('click', () => {
            toolboxV2.classList.toggle('collapsed');
        });
    }

    // Cube Lighting Controls
    if (emissiveColorPickerV2) {
        emissiveColorPickerV2.addEventListener('input', (e) => {
            const color = parseInt(e.target.value.substring(1), 16);
            cubeLightingManager.setEmissiveColor(color);
        });
    }

    if (emissiveIntensitySliderV2) {
        emissiveIntensitySliderV2.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            emissiveIntensityValueV2.textContent = value.toFixed(1);
            cubeLightingManager.setEmissiveIntensity(value);
        });
    }

    if (lightIntensitySliderV2) {
        lightIntensitySliderV2.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            lightIntensityValueV2.textContent = value.toFixed(1);
            cubeLightingManager.setLightIntensity(value);
        });
    }

    if (toggleInnerCubesV2) {
        toggleInnerCubesV2.addEventListener('change', () => {
            const showInner = toggleInnerCubesV2.checked;
            cubeGroup.children.forEach(cube => {
                const { x, y, z } = cube.gridPosition;
                const isInner = x > 0 && x < gridSize - 1 &&
                                y > 0 && y < gridSize - 1 &&
                                z > 0 && z < gridSize - 1;
                if (isInner) {
                    cube.visible = showInner;
                    hitboxGroup.children.find(h => h.userData.visualCube === cube).visible = showInner;
                }
            });
        });
    }
}

// Helper function for slider visuals
export function setupStyledSlider(sliderEl, valueEl, options = {}) {
    const { isFloat = false, format = val => `[${val}]` } = options;

    const updateSliderVisuals = () => {
        const value = isFloat ? parseFloat(sliderEl.value) : parseInt(sliderEl.value, 10);
        const min = isFloat ? parseFloat(sliderEl.min) : parseInt(sliderEl.min, 10);
        const max = isFloat ? parseFloat(sliderEl.max) : parseInt(sliderEl.max, 10);
        
        if (valueEl) {
            valueEl.textContent = format(isFloat ? value.toFixed(2) : value);
        }
        
        const percent = ((value - min) / (max - min)) * 100;
        sliderEl.style.background = `linear-gradient(to right, #ffd700 ${percent}%, rgba(0, 0, 0, 0.15) ${percent}%)`;
    };

    if (sliderEl && valueEl) {
        sliderEl.addEventListener('input', updateSliderVisuals);
        updateSliderVisuals();
    }
}
