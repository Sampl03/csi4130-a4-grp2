import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import * as INSTANCEPOS from "/code/js/modules/instancedpos.js";

const gltfLoader = new GLTFLoader();

export const SkyColors = {
    day: new THREE.Color(new THREE.Color(0x3299CC))
};

/* Trees */
export function fetchTreeMeshes(callback) {
    let treeMeshes = []
    let treeReady = new Array(4).fill(false);

    // Load the first tree
    gltfLoader.load('/code/assets/low_poly_tree_with_snow_on_top.glb', (gltf) => {
        let mesh = gltf.scene.getObjectByName("Cube_Material_0");
        treeMeshes.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.trees[0]));
        treeReady[0] = true;
        loadedModel();
    });

    // Second tree
    gltfLoader.load('/code/assets/low-poly_snow_tree.glb', (gltf) => {
        for (let mesh of gltf.scene.getObjectsByProperty("type", "Mesh")) {
            treeMeshes.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.trees[1]));
        };
        treeReady[1] = true;
        loadedModel();
    });

    // Third and fourth trees (snowy pine + dead tree)
    gltfLoader.load('/code/assets/lowpoly_forest.glb', (gltf) => {
        let meshes = gltf.scene.getObjectsByProperty("type", "Mesh");

        // pine
        treeMeshes.push(convertMeshToInstancedMesh(meshes[1], INSTANCEPOS.trees[2]));
        treeMeshes.push(convertMeshToInstancedMesh(meshes[2], INSTANCEPOS.trees[2]));
        treeMeshes.push(convertMeshToInstancedMesh(meshes[47], INSTANCEPOS.trees[2]));
        treeReady[2] = true;

        // dead tree
        treeMeshes.push(convertMeshToInstancedMesh(meshes[43], INSTANCEPOS.trees[3]));
        treeMeshes.push(convertMeshToInstancedMesh(meshes[44], INSTANCEPOS.trees[3]));
        treeReady[3] = true;

        loadedModel();
    });

    // Regrouping function
    function loadedModel() {
        if (!treeReady.includes(false))
            callback(treeMeshes);
    }
}

/* Houses */
export function fetchHouseMeshes(callback) {
    let houseMeshes = [];
    let houseReady = new Array(4).fill(false);

    // Load the mini houses
    gltfLoader.load('/code/assets/Snowy Houses.glb', (gltf) => {
        const groups = gltf.scene.children;
        for (let i = 0; i < 4; i++) // Only render 4 houses instead of 8
        {
            for (const mesh of groups[i].children) {
                houseMeshes.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.houses[i]));
            }
            houseReady[i] = true;
        }
        loadedModel();
    });

    // Regrouping function
    function loadedModel() {
        if (!houseReady.includes(false))
            callback(houseMeshes);
    }
}

/* Utility */
function convertMeshToInstancedMesh(mesh, matrices) {
    let instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, matrices.length);

    for (let i = 0; i < matrices.length; i++)
        instancedMesh.setMatrixAt(i, matrices[i]);

    return instancedMesh;
}