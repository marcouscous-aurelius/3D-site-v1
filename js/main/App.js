import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SceneManager } from './js/core/SceneManager.js';
import { EventManager } from './js/utils/EventManager.js';
import { SettingsManager } from './js/utils/SettingsManager.js';
import { defaultSettingsV2 } from './js/config/settings.js';
import { VersionManager } from './js/utils/VersionManager.js';

class App {
    constructor() {
        this.initManagers();
        this.initScene();
        this.initRendering();
        this.initUI();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initManagers() {
        this.eventManager = new EventManager();
        this.settingsManager = new SettingsManager('portfolio3DSettings-v2', defaultSettingsV2, '2.0.0');
        this.versionManager = new VersionManager();
        
        // Add settings validators
        this.settingsManager.addValidator('influence', value => value >= 0 && value <= 200);
        this.settingsManager.addValidator('fogNear', value => value >= 0 && value <= 100);
        this.settingsManager.addValidator('fogFar', value => value >= 0 && value <= 200);
        
        // Load settings
        this.settings = this.settingsManager.load();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#threejs-container'),
            antialias: true
        });
        
        this.sceneManager = new SceneManager(this.scene, this.camera, this.renderer);
        
        // Initialize scene with loaded settings
        this.applySettings(this.settings);
    }

    initRendering() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Setup performance monitoring
        this.sceneManager.performanceMonitor.addListener(stats => {
            if (stats.fps < 30) {
                this.enablePerformanceMode();
            } else {
                this.disablePerformanceMode();
            }
        });
    }

    initUI() {
        // Setup UI controls with debounced events
        this.eventManager.addEventListener(window, 'resize', () => {
            this.handleResize();
        }, { debounce: 250 });

        this.eventManager.addEventListener(window, 'pointermove', (event) => {
            this.handlePointerMove(event);
        }, { passive: true });
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        // Update scene with frame-rate independent timing
        this.sceneManager.update();
        
        // Render only visible objects
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    handlePointerMove(event) {
        // Update pointer position with optimized calculations
    }

    enablePerformanceMode() {
        // Reduce visual quality for better performance
        this.renderer.setPixelRatio(1);
        this.renderer.shadowMap.enabled = false;
    }

    disablePerformanceMode() {
        // Restore visual quality
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
    }

    applySettings(settings) {
        // Apply settings with validation
        try {
            // ... apply settings safely
        } catch (error) {
            console.error('Error applying settings:', error);
            // Fallback to default settings
            this.applySettings(defaultSettingsV2);
        }
    }

    dispose() {
        // Clean up resources
        this.sceneManager.dispose();
        this.eventManager.clearAllListeners();
        this.renderer.dispose();
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
