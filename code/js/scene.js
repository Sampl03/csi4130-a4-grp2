import * as THREE from "three";
import * as ASSETS from "/code/js/assets.js"

export function populateScene(scene) {
    scene.renderer.setClearColor(ASSETS.SkyColors.day);
    
    scene.camera.position.setZ(25);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const axes = new THREE.AxesHelper(5);
    scene.add(axes);

    // Updatables -> objects with a tick(deltaTime) function that needs to be called every frame
    let updatables = [];

    // TODO: Add lighting

    // TODO: Use a cubemap for the skybox

    // TODO: Add terrain

    // TODO: Add instanced trees

    // TODO: Add mini-village

    // TODO: Add train/mini-santa/else?

    return updatables;
}