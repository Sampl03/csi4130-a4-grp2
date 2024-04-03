import * as THREE from "three";
import * as ASSETS from "/code/js/assets.js"

export function populateScene(scene, updatables) {
    scene.renderer.setClearColor(ASSETS.SkyColors.day);
    
    scene.camera.position.setZ(25);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const axes = new THREE.AxesHelper(5);
    scene.add(axes);

    scene.add(new THREE.DirectionalLight(0xfffffff, 5));

    // TODO: Add lighting

    // TODO: Use a cubemap for the skybox

    // TODO: Add terrain

    // Add instanced trees
    let treeGroup = new THREE.Group();
    ASSETS.fetchTreeMeshes((trees) => { for (let tree of trees) treeGroup.add(tree); });
    scene.add(treeGroup);

    // TODO: Add mini-village

    // TODO: Add train/mini-santa/else?
}