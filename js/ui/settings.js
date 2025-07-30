import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { setSettingsBtnV2, resetSettingsBtnV2, toggleInnerCubesV2, influenceSliderV2,
         toggleFogV2, fogNearSliderV2, fogFarSliderV2, fogColorPickerV2, bgColorPickerV2,
         cubeColorPickerV2, cubeOpacitySliderV2 } from './toolbox.js';

export const settingsKeyV2 = 'portfolio3DSettings-v2';
export const currentFogColor = new THREE.Color(0xfafafa);
export const cubeBaseColor = new THREE.Color(0xffffff);
export let influenceRadius = 100;

export const defaultSettingsV2 = {
    innerCubes: true,
    influence: 88,
    fogEnabled: true,
    fogNear: 20,
    fogFar: 60,
    fogColor: '#fafafa',
    bgColor: '#fafafa',
    cubeColor: '#ffffff',
    cubeOpacity: 1.0,
    splinePoints: [
        { x: 0, y: 1 },
        { x: 0.5, y: 0.5 },
        { x: 1, y: 0 }
    ]
};

export function updateFogSettings() {
    if (toggleFogV2.checked) {
        const fogNear = parseInt(fogNearSliderV2.value, 10);
        const fogFar = parseInt(fogFarSliderV2.value, 10);

        if (scene.fog) {
            scene.fog.color.copy(currentFogColor);
            scene.fog.near = fogNear;
            scene.fog.far = fogFar;
        } else {
            scene.fog = new THREE.Fog(currentFogColor, fogNear, fogFar);
        }
        scene.background.copy(currentFogColor);
    } else {
        scene.fog = null;
        scene.background.set(bgColorPickerV2.value);
    }
}

export function saveSettingsV2() {
    const settings = {
        innerCubes: toggleInnerCubesV2.checked,
        influence: influenceSliderV2.value,
        fogEnabled: toggleFogV2.checked,
        fogNear: fogNearSliderV2.value,
        fogFar: fogFarSliderV2.value,
        fogColor: fogColorPickerV2.value,
        bgColor: bgColorPickerV2.value,
        cubeColor: cubeColorPickerV2.value,
        cubeOpacity: cubeOpacitySliderV2.value,
        splinePoints: window.splineController ? window.splineController.controlPoints : defaultSettingsV2.splinePoints
    };
    localStorage.setItem(settingsKeyV2, JSON.stringify(settings));
    setSettingsBtnV2.innerHTML = '<i class="fas fa-check"></i> SAVED!';
    setTimeout(() => {
        setSettingsBtnV2.innerHTML = '<i class="fas fa-save"></i> SET';
    }, 1500);
}

export function resetSettingsV2() {
    applySettingsV2(defaultSettingsV2);
    resetSettingsBtnV2.innerHTML = '<i class="fas fa-check"></i> RESET!';
    setTimeout(() => {
        resetSettingsBtnV2.innerHTML = '<i class="fas fa-undo"></i> RESET';
    }, 1500);
    localStorage.removeItem(settingsKeyV2);
}

export function applySettingsV2(settings) {
    toggleInnerCubesV2.checked = settings.innerCubes;
    influenceSliderV2.value = settings.influence;
    toggleFogV2.checked = settings.fogEnabled;
    fogNearSliderV2.value = settings.fogNear;
    fogFarSliderV2.value = settings.fogFar;
    fogColorPickerV2.value = settings.fogColor;
    bgColorPickerV2.value = settings.bgColor;
    cubeColorPickerV2.value = settings.cubeColor;
    cubeOpacitySliderV2.value = settings.cubeOpacity;

    if (window.splineController && settings.splinePoints) {
        window.splineController.controlPoints = JSON.parse(JSON.stringify(settings.splinePoints));
        window.splineController.draw();
    }

    document.querySelectorAll('.styled-slider').forEach(slider => {
        slider.dispatchEvent(new Event('input'));
    });
    
    toggleInnerCubesV2.dispatchEvent(new Event('change'));
    fogColorPickerV2.dispatchEvent(new Event('input'));
    bgColorPickerV2.dispatchEvent(new Event('input'));
    cubeColorPickerV2.dispatchEvent(new Event('input'));
    updateFogSettings();
}

export function loadSettingsV2() {
    const savedSettings = localStorage.getItem(settingsKeyV2);
    if (savedSettings) {
        applySettingsV2(JSON.parse(savedSettings));
    } else {
        applySettingsV2(defaultSettingsV2);
    }
}
