import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

import * as INSTANCEPOS from "/code/js/modules/instancedpos.js";

const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

export const SkyColors = {
    day: new THREE.Color(new THREE.Color(0x3299CC))
};

/* Roads */
export function fetchRoadsMeshes(callback) {
    // Load the mini houses
    gltfLoader.load('/code/assets/models/modular_roads_pack/scene.gltf', (gltf) => {
        const straight2xRoadMesh = gltf.scene.children[0].children[0].children[0].children[1];
        const curve1xRoadMesh = gltf.scene.children[0].children[0].children[0].children[6];
        let roads  = []
        for (let mesh of straight2xRoadMesh.getObjectsByProperty("type", "Mesh")) {
            roads.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.roads[0]));
        };

        for (let mesh of curve1xRoadMesh.getObjectsByProperty("type", "Mesh")) {
            roads.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.roads[1]));
        };
        callback(roads);
    });
}

/* Trees */
export function fetchTreeMeshes(callback) {
    // Load the first tree
    gltfLoader.load('/code/assets/low_poly_tree_with_snow_on_top.glb', (gltf) => {
        let mesh = gltf.scene.getObjectByName("Cube_Material_0");
        callback([convertMeshToInstancedMesh(mesh, INSTANCEPOS.trees[0])])
    });

    // Second tree
    gltfLoader.load('/code/assets/low-poly_snow_tree.glb', (gltf) => {
        let trees = [];
        for (let mesh of gltf.scene.getObjectsByProperty("type", "Mesh")) {
            trees.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.trees[1]));
        };
        callback(trees);
    });

    // Third and fourth trees (snowy pine + dead tree)
    gltfLoader.load('/code/assets/lowpoly_forest.glb', (gltf) => {
        let meshes = gltf.scene.getObjectsByProperty("type", "Mesh");
        let trees = []

        // pine
        trees.push(convertMeshToInstancedMesh(meshes[1], INSTANCEPOS.trees[2]));
        trees.push(convertMeshToInstancedMesh(meshes[2], INSTANCEPOS.trees[2]));
        trees.push(convertMeshToInstancedMesh(meshes[47], INSTANCEPOS.trees[2]));

        // dead tree
        trees.push(convertMeshToInstancedMesh(meshes[43], INSTANCEPOS.trees[3]));
        trees.push(convertMeshToInstancedMesh(meshes[44], INSTANCEPOS.trees[3]));

        callback(trees);
    });
}

/* Tracks */
export function fetchTracksMeshes(callback) {
    // Load the mini houses
    gltfLoader.load('code/assets/models/train_track/scene.gltf', (gltf) => {
        let meshes = gltf.scene.getObjectsByProperty("type", "Mesh");
        let tracks  = []
        for (let mesh of meshes) {
            tracks.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.tracks[0]));
        };
        
        callback(tracks);
    });
}

/* Houses */
export function fetchHouseMeshes(callback) {
    // Load the mini houses
    gltfLoader.load('/code/assets/Snowy Houses.glb', (gltf) => {
        const houseGroups = gltf.scene.children;
        let houses = []
        for (let i = 0; i < 4; i++) // Only render 4 houses instead of 8
            for (const mesh of houseGroups[i].children)
                houses.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.houses[i]));
        callback(houses);
    });
}

/* Train */
export function fetchTrainObject(callback) {
    // Load the train
    gltfLoader.load('/code/assets/steam_train_valley_railroad_97.glb', (gltf) => {
        const rail = gltf.scene.getObjectByName("Rail");
        rail.parent.remove(rail);
        const wagon = gltf.scene.getObjectByName("Wagon002");
        wagon.parent.remove(wagon);
        gltf.scene.scale.multiplyScalar(0.8)
        gltf.scene.position.setY(0.88);
        gltf.scene.position.z -= 3;
        callback(gltf.scene);
    })
}

export function fetchHipHopAnimation(callback) {
    fbxLoader.load('code/assets/Hip Hop Dancing.fbx', (fbx) => {
        fbx.position.set(-14, 0.6, -13)
        fbx.rotation.set(0, 135, 0)
        fbx.scale.multiplyScalar(0.1)
        callback(fbx)
    });
}

export function fetchTwistAnimation(callback) {
    fbxLoader.load('code/assets/Twist Dance.fbx', (fbx) => {
        fbx.position.set(14, 0.6, -12)
        fbx.rotation.set(0, 135, 0)
        fbx.scale.multiplyScalar(0.1)
        callback(fbx)
    });
}

/* Utility */
function convertMeshToInstancedMesh(mesh, matrices) {
    let instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, matrices.length);

    for (let i = 0; i < matrices.length; i++)
        instancedMesh.setMatrixAt(i, matrices[i]);

    return instancedMesh;
}

// https://stackoverflow.com/a/58165372
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}
