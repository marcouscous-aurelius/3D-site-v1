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
    ],
    performanceMode: {
        enabled: false,
        fpsThreshold: 30,
        reducedShadowQuality: true,
        reducedParticles: true
    },
    version: '2.0.0'
};

export const PHYSICS_CONFIG = {
    SPRING: 0.4,
    FRICTION: 0.92,
    BOUNCE: 0.7,
    MASS: 1.2,
    MARGIN: 20,
    DRAG_DAMPING: 0.6
};

export const ANIMATION_CONFIG = {
    moveDistance: 2,
    colorDarkness: 0.0,
    lerpFactor: 0.1,
    minFPS: 30
};

export const RENDER_CONFIG = {
    shadowMapSize: 2048,
    maxPixelRatio: 2,
    antialias: true,
    shadowBias: -0.0001,
    normalBias: 0.001
};
