import * as THREE from "three";
import * as ASSETS from "/code/js/assets.js"
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"

export function populateScene(scene, updatables) {
    scene.renderer.setClearColor(ASSETS.SkyColors.day);
    
    scene.camera.position.set(0, 30, -50);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const axes = new THREE.AxesHelper(5);
    scene.add(axes);

    let light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 50, -20);
    scene.add(light);

    // TODO: Add lighting

    // TODO: Use a cubemap for the skybox
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const cubeMapTexture = cubeTextureLoader.load([
        'code/assets/skybox_cubemap/skybox_px.jpg', // right
        'code/assets/skybox_cubemap/skybox_nx.jpg', // left
        'code/assets/skybox_cubemap/skybox_py.jpg', // top
        'code/assets/skybox_cubemap/skybox_ny.jpg', // bottom
        'code/assets/skybox_cubemap/skybox_pz.jpg', // front
        'code/assets/skybox_cubemap/skybox_nz.jpg', // back
    ])

    scene.background = cubeMapTexture

    // TODO: Add terrain
    const terrainGeometry = new THREE.PlaneGeometry(60, 60, 60, 60); // Width, height, width segments, height segments
    const positions = terrainGeometry.getAttribute('position')
    for (let i = 0; i < positions.count; i++) {
        const z = positions.getZ(i);
        positions.setZ(i, z * 50);
    }
    const textureLoader = new THREE.TextureLoader();
    const terrainMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load('code/assets/textures/ice_0001_1k_APRx3a/snow.jpg'),
        normalMap: textureLoader.load('code/assets/textures/ice_0001_1k_APRx3a/ice_0001_normal_opengl_1k.png'),
        displacementMap: textureLoader.load('code/assets/textures/ice_0001_1k_APRx3a/ice_0001_height_1k.png'),
        aoMap: textureLoader.load('code/assets/textures/ice_0001_1k_APRx3a/ice_0001_ao_1k.jpg'),
        roughnessMap: textureLoader.load('code/assets/textures/ice_0001_1k_APRx3a/ice_0001_roughness_1k.jpg'),
        color: 0xFFFFFF
    }); // Simple white material for snow
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2; // Rotate the plane to lay it flat
    scene.add(terrain);

    // TODO: Add Roads
    let roadGroups = new THREE.Group();
    ASSETS.fetchRoadsMeshes((roads) => { for (let road of roads) roadGroups.add(road); });
    scene.add(roadGroups);

    // Add instanced trees
    let treeGroup = new THREE.Group();
    ASSETS.fetchTreeMeshes((trees) => { for (let tree of trees) treeGroup.add(tree); });
    scene.add(treeGroup);

    // Add instanced houses
    let houseGroup = new THREE.Group();
    ASSETS.fetchHouseMeshes((houses) => { for (let house of houses) houseGroup.add(house); });
    scene.add(houseGroup);

    // Add train
    let trainGroup = new THREE.Group();
    ASSETS.fetchTrainObject((train) => { trainGroup.add(train); });
    scene.add(trainGroup);
}