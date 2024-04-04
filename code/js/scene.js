import * as THREE from "three";
import * as ASSETS from "/code/js/assets.js"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

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
    const terrainGeometry = new THREE.PlaneGeometry(300, 300, 60, 60); // Width, height, width segments, height segments
    const positions = terrainGeometry.getAttribute('position')
    for (let i = 0; i < positions.count; i++) {
        const z = positions.getZ(i);
        positions.setZ(i, z * 50); // Increase this multiplier
    }
    const textureLoader = new THREE.TextureLoader();
    const terrainMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load('code/textures/ice_0001_1k_APRx3a/snow.jpg'),
        normalMap: textureLoader.load('code/textures/ice_0001_1k_APRx3a/ice_0001_normal_opengl_1k.png'),
        displacementMap: textureLoader.load('code/textures/ice_0001_1k_APRx3a/ice_0001_height_1k.png'),
        aoMap: textureLoader.load('code/textures/ice_0001_1k_APRx3a/ice_0001_ao_1k.jpg'),
        roughnessMap: textureLoader.load('code/textures/ice_0001_1k_APRx3a/ice_0001_roughness_1k.jpg'),
        color: 0xFFFFFF
    }); // Simple white material for snow
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2; // Rotate the plane to lay it flat
    scene.add(terrain);

    // TODO: Add Roads

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