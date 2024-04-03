import * as THREE from "three";
import * as ASSETS from "/code/js/assets.js"

export function populateScene(scene, updatables) {
    scene.renderer.setClearColor(ASSETS.SkyColors.day);
    
    scene.camera.position.setZ(-10);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const axes = new THREE.AxesHelper(5);
    scene.add(axes);

    let light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(-10, 10, -10);
    scene.add(light);

    // TODO: Add lighting

    // TODO: Use a cubemap for the skybox

    // TODO: Add terrain

    // Add instanced trees
    let treeGroup = new THREE.Group();
    ASSETS.fetchTreeMeshes((trees) => { for (let tree of trees) treeGroup.add(tree); });
    scene.add(treeGroup);

    // Add instanced houses
    let houseGroup = new THREE.Group();
    ASSETS.fetchHouseMeshes((houses) => { for (let house of houses) houseGroup.add(house); });
    scene.add(houseGroup);

    // TODO: Add train/mini-santa/else?
}