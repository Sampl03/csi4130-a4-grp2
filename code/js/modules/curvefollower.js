import * as THREE from 'three';

const up = new THREE.Vector3(0, 1, 0);

export class CurveFollower {
    /**
     * Assigns an Object3D to follow the specified Curve with the specified speed.
     * Movement is disabled by default and can be enabled by setting CurveFollower.enabled
     * 
     * @param {Curve} curve The curve to follow
     * @param {Object3D} object3d The object to move
     * @param {number} baseSpeed The speed to move at
     */
    constructor(curve, object3d, baseSpeed = 1) {
        this.curve = curve;
        this.object = object3d;
        this.enabled = false;
        this.speed = baseSpeed;
        this.u = 0;
    }

    /**
     * The update function which moves the object when the follower is enabled
     * @param {int} deltaTime the time between frames
     */
    update(deltaTime) {
        if (!this.enabled) return;

        const totalLength = this.curve.getLength();
        const du = deltaTime * this.speed / totalLength;

        this.u += du;
        this.u -= Math.floor(this.u);
        const tangent = this.curve.getTangentAt(this.u);
        const eye = this.curve.getPointAt(this.u);
        const target = eye.clone().add(tangent);
        this.object.position.copy(eye);
        this.object.lookAt(target);
    }


}