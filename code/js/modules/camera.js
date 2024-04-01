import * as THREE from 'three';

/**
 * This module's purpose is to implement controls by modifying a three.js camera
 * 
 * Linear movement:
 *    W/S   - Front/Back
 *    A/D   - Left/Right
 *    Q/E   - Down/Up
 *    Shift - Move at 4 x speed
 * 
 * Rotational movement (Holding LMB):
 *    Up/Down/Left/Right
 * 
 * A controlled camera will have the isControlledCamera property set to true.
 * 
 * 'cameraSpeed' exposes the linear speed 
 * 'cameraRotPixels' exposes the pixels needed to do a 180 degrees rotation
 * 'controlsEnabled' enable/disables the controls (so that the camera can be moved by something else)
 */

const DEFAULT_SPEED = 10;
const DEFAULT_ROTPIXELS = 600;

/**
 * Setup three.js camera for controls
 * @param camera - A three.js camera
 * @param eventDOMElement - The element used to intercept key and mouse events
 * @param speed - The linear speed of movement, or default if undefined
 * @param rotPixels - How many pixels the mouse needs to move to rotate 180 degrees, or default 
 * @returns true on success, false on failure
 */
export function bindControlsToCamera(camera, eventDOMElement, speed, rotPixels) {
    if (!camera.isCamera)
        return false;

    // Default speeds
    if (typeof(speed) != "number")
        speed = DEFAULT_SPEED;
    if (typeof(rotPixels) != "number")
        rotPixels = DEFAULT_ROTPIXELS;

    // Add speed properties to camera
    Object.defineProperty(camera, 'cameraSpeed', {
        enumerable: true,
        get: function() { return speed; },
        set: function(v) {
            if (typeof(v) != "number") return; // Don't change if invalid
            speed = v;
        }
    });
    
    Object.defineProperty(camera, 'cameraRotPixels', {
        enumerable: true,
        get: function() { return rotPixels; },
        set: function(v) {
            if (typeof(v) == "number") rotPixels = v; // Don't change if invalid
            rotPixels = v;
        }
    });

    let enabled = true;

    // Keyboard handling
    let keyState = {
        forward: false, backward: false,
        left: false, right: false,
        up: false, down: false,
        shift: false, ctrl: false
    };

    Object.defineProperty(camera, 'controlsEnabled', {
        enumerable: true,
        get: function () { return enabled; },
        set: function (v) {
            enabled = !!v;
            if (!enabled) {
                for (let key in keyState) keyState[key] = false;
                mouseState.mousedown = false;
            }
        }
    })

    document.addEventListener('keydown', (kev) => handleKeyboard(kev, true, keyState));
    document.addEventListener('keyup', (kev) => handleKeyboard(kev, false, keyState));

    // Mouse handling
    let mouseState = { deltaX: 0, deltaY: 0, mousedown: false};
    let oldX = 0, oldY = 0;
    eventDOMElement.addEventListener('mousedown', function (mev) {
        oldX = mev.screenX;
        oldY = mev.screenY;
        mouseState.mousedown = true
    });
    eventDOMElement.addEventListener('mouseup', function (mev) {
        mouseState.mousedown = false;
    });
    eventDOMElement.addEventListener('mousemove', function (mev) {
        if (!mouseState.mousedown) return;
        if (!camera.controlsEnabled) return;
        mouseState.deltaX = mev.screenX - oldX;
        mouseState.deltaY = mev.screenY - oldY;
        oldX = mev.screenX;
        oldY = mev.screenY;
    });

    // Update function to call each frame
    const pitchAxis = new THREE.Vector3(1, 0, 0);
    const yawAxis = new THREE.Vector3(0, 1, 0);
    camera.update = function(dt) {
        if (!camera.controlsEnabled) return;

        if (typeof(dt) != "number")
            dt = 1/60;

        // Rotate the camera
        const angleYaw = -Math.PI * mouseState.deltaX / rotPixels;
        const anglePitch = -Math.PI * mouseState.deltaY / rotPixels;
        
        camera.quaternion.multiply((new THREE.Quaternion()).setFromAxisAngle(pitchAxis, anglePitch));
        camera.quaternion.premultiply((new THREE.Quaternion()).setFromAxisAngle(yawAxis, angleYaw));

        // Calculate the position offset
        const movement = new THREE.Vector3(
            keyState.right - keyState.left, // Cursed 'booleans are numbers'
            keyState.up - keyState.down,
            keyState.backward - keyState.forward
        );
        if (keyState.shift)
            movement.multiplyScalar(4);
        if (keyState.ctrl)
            movement.multiplyScalar(1/4);
        movement.multiplyScalar(speed * dt);
        movement.applyQuaternion(camera.quaternion);
        camera.position.add(movement);

        // Reset camera movement
        mouseState.deltaX = 0;
        mouseState.deltaY = 0;
    }

    camera.isControlledCamera = true;
    return true;
}

function handleKeyboard(kev, keydown, keyState) {
    switch (kev.key.toLowerCase()) {
        case 'w': keyState.forward = keydown; break;
        case 's': keyState.backward = keydown; break;
        case 'a': keyState.left = keydown; break;
        case 'd': keyState.right = keydown; break;
        case 'q': keyState.down = keydown; break;
        case 'e': keyState.up = keydown; break;
        case 'shift': keyState.shift = keydown; break;
        default: return;
    }
    kev.preventDefault();
}