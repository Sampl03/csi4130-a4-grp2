import * as THREE from "three";
import { populateScene } from "/code/js/scene.js";
import { bindControlsToCamera } from "./modules/camera.js";

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
    bindControlsToCamera(camera, renderer.domElement);

    /* Create the scene */
    scene = new THREE.Scene();
    scene.renderer = renderer;
    scene.camera = camera;
    let updatables = [];
    populateScene(scene, updatables);

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

    renderer.render(scene, camera);
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