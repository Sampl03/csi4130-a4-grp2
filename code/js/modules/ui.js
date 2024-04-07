import * as THREE from "three";
import { GUI } from "dat.gui";

export function createGUI(scene) {
    let gui = new GUI();
    const ambientLight = scene.ambientLight;
    const dirLight = scene.dirLight;
    const camera = scene.camera;
    const train = scene.train;

    /* Lighting controls */
    let lightControls = {
        ambColor: [ambientLight.color.r, ambientLight.color.g, ambientLight.color.b].map(x => 255 * x),
        dirColor: [dirLight.color.r, dirLight.color.g, dirLight.color.b].map(x => 255 * x),
        dirAzimuth: 0,
        dirElevation: 0,
        visualiseLight: false
    }
    const dirLightRadius = dirLight.position.length();

    let lightFolder = gui.addFolder("Lighting");
    lightFolder.addColor(lightControls, "ambColor").name("Ambient Color")
            .onChange((color) => { ambientLight.color.fromArray(color.map(x => x/255)); });
    lightFolder.addColor(lightControls, "dirColor").name("Directional Color")
            .onChange((color) => {
                dirLight.color.fromArray(color.map(x => x/255));
                dirLight.visualisation?.update();
            });
    lightFolder.add(lightControls, "dirAzimuth", -180, 180).name("Dir. Azimuth")
            .onChange(function() {
                setLightPosition(dirLight, lightControls.dirAzimuth, lightControls.dirElevation, dirLightRadius);
                dirLight.visualisation?.update();
            });
    lightFolder.add(lightControls, "dirElevation", -90, 90).name("Dir. Elevation")
            .onChange(function() {
                setLightPosition(dirLight, lightControls.dirAzimuth, lightControls.dirElevation, dirLightRadius);
                dirLight.visualisation?.update();
            });
    lightFolder.add(lightControls, "visualiseLight").name("See light")
            .onChange((show) => {
                if (dirLight.visualisation) {
                    dirLight.visualisation.removeFromParent();
                    dirLight.visualisation = null;
                }

                if (show) {
                    dirLight.visualisation = new THREE.DirectionalLightHelper(dirLight);
                    scene.add(dirLight.visualisation);
                }
            });

    /* Camera controls */
    let camControls = {
        speed: camera.cameraSpeed,
        rotPixels: camera.cameraRotPixels,
        fov: camera.fov,
        visualisePath: false,
        followPath: camera.toggleMovement
    }

    let camFolder = gui.addFolder("Camera");
    camFolder.add(camControls, "speed", 0, 30).name("Speed")
             .onChange((newSpeed) => { camera.cameraSpeed = camera.pathFollower.speed = newSpeed; });
    camFolder.add(camControls, "rotPixels", 100, 1e3).name("Rot. (px/180°)")
             .onChange((newSpeed) => { camera.cameraRotPixels = newSpeed; });
    camFolder.add(camControls, "fov", 30, 120).name("Field of View")
             .onChange((newFOV) => { camera.fov = newFOV; });
    camFolder.add(camControls, "visualisePath").name("See path")
             .onChange((show) => { showPathHelper(scene, camera.path, show); });
    camFolder.add(camControls, "followPath").name("Toggle Camera Mode");

    /* Train controls */
    let trainControls = {
        speed: train.pathFollower.speed,
        visualisePath: false
    }

    let trainFolder = gui.addFolder("Train");
    trainFolder.add(trainControls, "speed", -30, 50).name("Speed")
               .onChange((newSpeed) => { train.pathFollower.speed = newSpeed; });
    trainFolder.add(trainControls, "visualisePath").name("See path")
               .onChange((show) => {
                    showPathHelper(scene, train.path, show);
                    if (show)
                        train.path.visTube.position.y = 1;
                        train.path.visSpheres.position.y = 1;
                });

    return gui;
}

function setLightPosition(light, azimuth, elevation, radius) {
    let aziRads = azimuth * Math.PI / 180;
    let elevRads = elevation * Math.PI / 180;

    let horiz = radius * Math.cos(elevRads);
    light.position.set(
        -horiz * Math.sin(aziRads),
        radius * Math.sin(elevRads),
        -horiz * Math.cos(aziRads)
    )
}

const pathHelperMat = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.7, transparent: true});
const pathHelperPointMat = new THREE.MeshBasicMaterial({color: 0x0000ff});
function showPathHelper(scene, path, show) {
    if (path.visTube || path.visSpheres) {
        path.visTube?.removeFromParent();
        path.visSpheres?.removeFromParent();
        path.visTube = null;
        path.visSpheres = null;
    }

    if (show) {
        const tubeGeom = new THREE.TubeGeometry(path, 500, 0.1);
        const sphereGeom = new THREE.SphereGeometry(0.15);
        path.visTube = new THREE.Mesh(tubeGeom, pathHelperMat);
        path.visSpheres = new THREE.InstancedMesh(sphereGeom, pathHelperPointMat, path.points.length);

        for (let i = 0; i < path.points.length; i++) {
            const point = path.points[i];
            path.visSpheres.setMatrixAt(i, new THREE.Matrix4().makeTranslation(point));
        }

        scene.add(path.visTube);
        scene.add(path.visSpheres);
    }
}