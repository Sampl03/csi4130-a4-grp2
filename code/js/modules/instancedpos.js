import * as THREE from "three";

/* Tree positions */
export const trees = function() {
    let trees = [];
    let basis;

    // low_poly_tree_with_snow_on_top.glb
    basis = convertConfigToMatrix4([0, 0.7, 0], [-90, 0, 0], 0.7);
    trees[0] = [
        convertConfigToMatrix4([-15, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    // low-poly_snow_tree.glb
    basis = convertConfigToMatrix4([0, 0, 0], [-90, 0, 0], 5);
    trees[1] = [
        convertConfigToMatrix4([-5, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    // lowpoly_forest.glb - snowy pine
    basis = convertConfigToMatrix4([0, .5, 0], [-90, 0, 0], 0.8);
    trees[2] = [
        convertConfigToMatrix4([5, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    // lowpoly_forest.glb - dead tree
    basis = convertConfigToMatrix4([-18, 1.8, 0], [-90, 0, 0], 1.8);
    trees[3] = [
        convertConfigToMatrix4([15, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    return trees;
}();

/* Utility */

/** Takes arrays [px, py, pz], [pitch, yaw, roll], scale and creates a Matrix4 out of it */
function convertConfigToMatrix4(pos, angles, scale) {
    return (new THREE.Matrix4()).compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...(angles.map(x => Math.PI / 180 * x)))),
        new THREE.Vector3(scale, scale, scale)
    );
}