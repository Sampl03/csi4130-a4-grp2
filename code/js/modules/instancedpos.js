import * as THREE from "three";

/* Road Positions */
export const roads = function() {
    let roads = [];
    let basis;

    // Straight roads.glb
    basis = convertConfigToMatrix4([0, 0, 0], [0, 0, 0], 1);
    roads[0] = [
        convertConfigToMatrix4([17.3, 0.62, 0], [0, 0, 0], 0.0005),
        convertConfigToMatrix4([22.7, 0.62, 0], [0, 0, 0], 0.0005),
        convertConfigToMatrix4([-17.3, 0.62, 0], [0, 0, 0], 0.0005),
        convertConfigToMatrix4([-22.7, 0.62, 0], [0, 0, 0], 0.0005),
        convertConfigToMatrix4([0, 0.62, 17.3], [0, 90, 0], 0.0005),
        convertConfigToMatrix4([0, 0.62, 22.7], [0, 90, 0], 0.0005),
        convertConfigToMatrix4([0, 0.62, -17.3], [0, 90, 0], 0.0005),
        convertConfigToMatrix4([0, 0.62, -22.7], [0, 90, 0], 0.0005),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    roads[1] = [
        convertConfigToMatrix4([-9.3, 0.6, 0], [0, 90, 0], 0.0005),
        convertConfigToMatrix4([9.3, 0.6, 0], [0, -90, 0], 0.0005),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    return roads;
}();

/* Tree positions */
export const trees = function() {
    let trees = [];
    let basis;

    // low_poly_tree_with_snow_on_top.glb
    basis = convertConfigToMatrix4([0, 1.2, 0], [-90, 0, 0], 0.7);
    trees[0] = [
        // convertConfigToMatrix4([-15, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    // low-poly_snow_tree.glb
    basis = convertConfigToMatrix4([0, .5, 0], [-90, 0, 0], 5);
    trees[1] = [
        // convertConfigToMatrix4([-5, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    // lowpoly_forest.glb - snowy pine
    basis = convertConfigToMatrix4([0, 1, 0], [-90, 0, 0], 0.8);
    trees[2] = [
        convertConfigToMatrix4([0, 0, 0], [0, 0, 0], 2),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    // lowpoly_forest.glb - dead tree
    basis = convertConfigToMatrix4([-18, 2.8, 0], [-90, 0, 0], 1.8);
    trees[3] = [
        // convertConfigToMatrix4([15, 0, -20], [0, 0, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    return trees;
}();

/* House Positions */
export const houses = function() {
    let houses = [];
    let basis;

    // Snowy Houses.glb
    // Left Corner
    basis = convertConfigToMatrix4([-10, 2.8, -2.5], [0, 92, 0], 8);
    houses[0] = [
        convertConfigToMatrix4([24.5, 0, 3], [0, 0, 0], 1),
        convertConfigToMatrix4([11, 0, 4], [0, 60, 0], 1),
        convertConfigToMatrix4([6, 0, 10], [0, 45, 0], 1),
        convertConfigToMatrix4([3, 0, 24.5], [0, 90, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));
    
    // Right Top corner
    basis.setPosition(-3.5, 2.8, -2.5);
    houses[1] = [
        convertConfigToMatrix4([-24.5, 0, 3], [0, 0, 0], 1),
        convertConfigToMatrix4([-11, 0, 4], [0, -60, 0], 1),
        convertConfigToMatrix4([-6, 0, 10], [0, -45, 0], 1),
        convertConfigToMatrix4([-3, 0, 24.5], [0, -90, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));
    
    // Right Bottom Corner
    basis.setPosition(3.1, 2.8, -2.5);
    houses[2] = [
        convertConfigToMatrix4([-24.5, 0, -3], [0, 180, 0], 1),
        convertConfigToMatrix4([-11, 0, -4], [0, 240, 0], 1),
        convertConfigToMatrix4([-6, 0, -10], [0, 225, 0], 1),
        convertConfigToMatrix4([-3, 0, -24.5], [0, 270, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));
    
    // Right Bottom Corener
    basis.setPosition(9.6, 2.8, -2.6)
    houses[3] = [
        convertConfigToMatrix4([24.5, 0, -3], [0, -180, 0], 1),
        convertConfigToMatrix4([11, 0, -4], [0, -240, 0], 1),
        convertConfigToMatrix4([6, 0, -10], [0, -225, 0], 1),
        convertConfigToMatrix4([3, 0, -24.5], [0, -270, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));
    
    return houses;
}();

/* Tracks Positions */
export const tracks = function() {
    let tracks = [];
    let basis;

    // Straight tracks.glb
    basis = convertConfigToMatrix4([0, 0, 0], [0, 0, 0], 1);
    tracks[0] = [
        // convertConfigToMatrix4([0.1, 1, 1], [90, 0, 0], 0.5),
        convertConfigToMatrix4([19, 1, -16], [0, 0, 0], 1),
        convertConfigToMatrix4([19, 1, -12], [0, 0, 0], 1),
        convertConfigToMatrix4([-19, 1, -16], [0, 0, 0], 1),
        convertConfigToMatrix4([-19, 1, -12], [0, 0, 0], 1),
        convertConfigToMatrix4([19, 1, -12], [0, 0, 0], 1),
        convertConfigToMatrix4([15, 1, -18], [0, -90, 0], 1),
        convertConfigToMatrix4([13, 1, -18], [0, -90, 0], 1),
        convertConfigToMatrix4([15, 1, 18], [0, -90, 0], 1),
        convertConfigToMatrix4([13, 1, 18], [0, -90, 0], 1),
        // etc (add more)
    ].map((x) => x.multiply(basis));

    return tracks;
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