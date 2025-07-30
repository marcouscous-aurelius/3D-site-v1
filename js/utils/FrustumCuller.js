import * as THREE from 'three';

export class FrustumCuller {
    constructor(camera) {
        this.frustum = new THREE.Frustum();
        this.camera = camera;
        this.projScreenMatrix = new THREE.Matrix4();
    }

    update() {
        this.projScreenMatrix.multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        );
        this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    }

    isVisible(object) {
        // For objects with geometry, use their bounding sphere
        if (object.geometry && object.geometry.boundingSphere === null) {
            object.geometry.computeBoundingSphere();
        }

        const boundingSphere = object.geometry ? 
            object.geometry.boundingSphere.clone() : 
            new THREE.Sphere(object.position, 1);

        boundingSphere.applyMatrix4(object.matrixWorld);
        return this.frustum.intersectsSphere(boundingSphere);
    }
}
