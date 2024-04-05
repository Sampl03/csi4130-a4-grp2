import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import * as INSTANCEPOS from "/code/js/modules/instancedpos.js";

const gltfLoader = new GLTFLoader();

export const SkyColors = {
    day: new THREE.Color(new THREE.Color(0x3299CC))
};

/* Roads */
export function fetchRoadsMeshes(callback) {
    // Load the mini houses
    gltfLoader.load('/code/assets/models/modular_roads_pack/scene.gltf', (gltf) => {
        const straight1xRoadMesh = gltf.scene.children[0].children[0].children[0].children[0];
        const straight2xRoadMesh = gltf.scene.children[0].children[0].children[0].children[1];
        const straight3xRoadMesh = gltf.scene.children[0].children[0].children[0].children[2];
        const intersection1xRoadMesh = gltf.scene.children[0].children[0].children[0].children[3];
        const intersection2xRoadMesh = gltf.scene.children[0].children[0].children[0].children[4];
        const intersection3xRoadMesh = gltf.scene.children[0].children[0].children[0].children[5];
        const curve1xRoadMesh = gltf.scene.children[0].children[0].children[0].children[6];
        const curve2xRoadMesh = gltf.scene.children[0].children[0].children[0].children[7];
        const curve3xRoadMesh = gltf.scene.children[0].children[0].children[0].children[8];
        let roads  = []
        console.log(dumpObject(gltf.scene).join('\n'));
        for (let mesh of straight2xRoadMesh.getObjectsByProperty("type", "Mesh")) {
            roads.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.roads[0]));
        };

        // for (let mesh of intersection3xRoadMesh.getObjectsByProperty("type", "Mesh")) {
        //     roads.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.roads[1]));
        // };

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
        console.log(gltf.scene)
        callback([convertMeshToInstancedMesh(mesh, INSTANCEPOS.trees[0])])
    });

    // Second tree
    gltfLoader.load('/code/assets/low-poly_snow_tree.glb', (gltf) => {
        let trees = [];
        console.log(gltf.scene.getObjectsByProperty("type", "Mesh"))
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

/* Houses */
export function fetchHouseMeshes(callback) {
    // Load the mini houses
    gltfLoader.load('/code/assets/Snowy Houses.glb', (gltf) => {
        const houseGroups = gltf.scene.children;
        console.log(gltf.scene)
        let houses = []
        for (let i = 0; i < 4; i++) // Only render 4 houses instead of 8
            for (const mesh of houseGroups[i].children)
                houses.push(convertMeshToInstancedMesh(mesh, INSTANCEPOS.houses[i]));
        callback(houses);
    });
}

/* Utility */
function convertMeshToInstancedMesh(mesh, matrices) {
    let instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, matrices.length);

    for (let i = 0; i < matrices.length; i++)
        instancedMesh.setMatrixAt(i, matrices[i]);

    return instancedMesh;
}

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
