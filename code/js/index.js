import * as THREE from "three";
import { populateScene } from "/code/js/scene.js";
import { bindControlsToCamera } from "/code/js/modules/camera.js";
import { CurveFollower } from "/code/js/modules/curvefollower.js";

const cameraPosInfo = document.getElementById("camera-position");

let container = undefined;
let renderer = undefined;
let scene = undefined;
let camera = undefined;

function init() {
    /* Initialise the rendering surface */
    container = document.getElementById("render-container");

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color());
    container.appendChild(renderer.domElement);

    /* Initialise the camera */
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1e4);
    
    /* Create the scene */
    scene = new THREE.Scene();
    scene.renderer = renderer;
    scene.camera = camera;
    let updatables = [];
    populateScene(scene, updatables);
    
    /* Setup camera movement */
    bindControlsToCamera(camera, renderer.domElement);
    setCameraPath(camera);
    camera.toggleMovement = function() {
        camera.pathFollower.enabled = camera.controlsEnabled;
        camera.controlsEnabled = !camera.controlsEnabled;
    }

    /* Resize the renderer and camera to fit the viewport */
    resizeRender();

    /* Rendering loop */
    let lastFrame = window.performance.now();
    function tick() {
        let thisFrame = window.performance.now();
        let deltaTime = (thisFrame - lastFrame) / 1000;
        lastFrame = thisFrame;

        // Animation
        for (const updatable of updatables) {
            updatable.tick(scene, deltaTime);
        }

        // Rendering
        render(deltaTime);
    }
    renderer.setAnimationLoop(tick);
}

function render(deltaTime) {
    camera.update(deltaTime)
    camera.pathFollower.update(deltaTime);

    /* Update debug UI */
    cameraPosInfo.innerText = `Cam Pos = X: ${camera.position.x.toFixed(2)} Y: ${camera.position.y.toFixed(2)} Z: ${camera.position.z.toFixed(2)}`;
    const rotation = new THREE.Vector3().setFromEuler(camera.rotation);
    rotation.multiplyScalar(180 / Math.PI);
    cameraPosInfo.innerText += `\nCam Rot = X: ${rotation.x.toFixed(2)} Y: ${rotation.y.toFixed(2)} Z: ${rotation.z.toFixed(2)}`

    renderer.render(scene, camera);
}

function setCameraPath(camera) {
    camera.path = new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(0, 13, -40),
            new THREE.Vector3(0, 4, -30),
            new THREE.Vector3(0, 3, -25),
            new THREE.Vector3(0, 2.75, -20),
            new THREE.Vector3(0, 2.25, -12),
            new THREE.Vector3(2.5, 2.25, -9),
            new THREE.Vector3(4.6, 2.25, -8.1),
            new THREE.Vector3(6.8, 2.25, -6.5),
            new THREE.Vector3(7.4, 2.25, -5.6),
            new THREE.Vector3(9.18, 1.8, -1.5),
            new THREE.Vector3(9.2, 2, 1.4),
            new THREE.Vector3(8, 1.8, 4.6),
            new THREE.Vector3(6.35, 1.2, 6.86),
            new THREE.Vector3(3.43, 2.5, 8.74),
            new THREE.Vector3(-1.64, 6, 10.3),
            new THREE.Vector3(-7.5, 10, 7.75),
            new THREE.Vector3(-14.5, 15, -3),
            new THREE.Vector3(-10.3, 4.5, -16),
            new THREE.Vector3(-4, 4.25, -17.5),
            new THREE.Vector3(4, 3.5, -17.5),
            new THREE.Vector3(13, 3.5, -15.5),
            new THREE.Vector3(13, 2.2, -10.85),
            new THREE.Vector3(10.4, 2.8, -8.4),
            new THREE.Vector3(2.5, 14.53, -2.36),
            new THREE.Vector3(1, 19.2, -0.5),
            new THREE.Vector3(-10, 30, 20),
            new THREE.Vector3(-20.6, 33, 28.4),
            new THREE.Vector3(-22.9, 28, 20.85),
            new THREE.Vector3(10, 18, -35),
            new THREE.Vector3(4, 16, -50),
            new THREE.Vector3(1, 15, -50),
            new THREE.Vector3(0, 14, -42),
        ],
        true
    );
    camera.path.arcLengthDivisions = 1000;
    camera.path.updateArcLengths();
    camera.pathFollower = new CurveFollower(camera.path, camera, 5)
}

function resizeRender() {
    let renderRect = container.getBoundingClientRect();
    let aspectRatio = renderRect.width/renderRect.height;

    // Update the renderer's surface
    if (renderer !== undefined) {
        renderer.setSize(renderRect.width, renderRect.height);
    }

    // Update the camera aspect ratio to account for the window
    if (camera !== undefined) {
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('load', function() {
    init();
})

window.addEventListener('resize', function() {
    resizeRender();
})