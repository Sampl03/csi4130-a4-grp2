import * as THREE from "three";
import * as ASSETS from "/code/js/assets.js"
import { CurveFollower } from "/code/js/modules/curvefollower.js"
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";

export function populateScene(scene, updatables) {
    scene.renderer.setClearColor(ASSETS.SkyColors.day);
    
    scene.camera.position.set(0, 30, -70);
    // scene.camera.position.set(0, 90, 0);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const axes = new THREE.AxesHelper(5);
    scene.add(axes);

    let light = new THREE.DirectionalLight(0xb7a2ff, 3);
    light.color.convertLinearToSRGB();
    light.position.set(0, 40, -30);
    scene.add(light);
    scene.dirLight = light;

    let ambientLight = new THREE.AmbientLight(0xb7c2ff, 0.15);
    ambientLight.color.convertLinearToSRGB();
    scene.add(ambientLight);
    scene.ambientLight = ambientLight;

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

    // Add Ground Height
    const cubeGeometry = new THREE.BoxGeometry(60, 9, 60);
    const groundTextureLoader = new THREE.TextureLoader();
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: groundTextureLoader.load('code/assets/dylann-hendricks-zOsFL2AcG_k-unsplash.jpg'), // Set the environment map to the cube map we loaded
        color: 0x593E1A, 
    });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, -4.5, 0)
    scene.add(cube);

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

    // TODO: Add Tracks
    let trackGroups = new THREE.Group();
    ASSETS.fetchTracksMeshes((tracks) => { for (let track of tracks) trackGroups.add(track); });
    scene.add(trackGroups);

    // Add train
    let trainGroup = new THREE.Group();
    ASSETS.fetchTrainObject((train) => { trainGroup.add(train); });
    scene.train = trainGroup;   
    scene.add(trainGroup);

    // Create train path
    trainGroup.path = new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(19, 0, 0), // West
            new THREE.Vector3(19, 0, -5),
            new THREE.Vector3(19, 0, -14),
            new THREE.Vector3(15, 0, -18),
            new THREE.Vector3(5, 0, -18),
            new THREE.Vector3(0, 0, -18), // South
            new THREE.Vector3(-5, 0, -18),
            new THREE.Vector3(-15, 0, -18),
            new THREE.Vector3(-19, 0, -14),
            new THREE.Vector3(-19, 0, -5),
            new THREE.Vector3(-19, 0, 0), // East
            new THREE.Vector3(-19, 0, 5),
            new THREE.Vector3(-19, 0, 14),
            new THREE.Vector3(-15, 0, 18),
            new THREE.Vector3(-5, 0, 18),
            new THREE.Vector3(0, 0, 18), // West
            new THREE.Vector3(5, 0, 18),
            new THREE.Vector3(15, 0, 18),
            new THREE.Vector3(19, 0, 14),
            new THREE.Vector3(19, 0, 5),
        ],
        true, "catmullrom", 0.5
    );
    trainGroup.path.arcLengthDivisions = 1000;
    trainGroup.path.updateArcLengths();
    trainGroup.pathFollower = new CurveFollower(trainGroup.path, trainGroup, 10);
    trainGroup.pathFollower.enabled = true;
    updatables.push({ tick: (_, dt) => { trainGroup.pathFollower.update(dt); } });

    // TODO: Add Snow Falling effect
    let particles;
    let snowPositions = []; 
    let velocities = [];
    const noise = new SimplexNoise();

    const numSnowFlakes = 15000;

    const maxRange = 500;
    const minRange = maxRange/2;
    const minHeight = 0;

    const geometry = new THREE.BufferGeometry();

    const snowTextureLoader = new THREE.TextureLoader();

    for (let i=0; i < numSnowFlakes; i++) {
        snowPositions.push(
            Math.floor(Math.random() * maxRange - minRange), // x -500 to 500
            Math.floor(Math.random() * minRange + minHeight), // y 250 to 750
            Math.floor(Math.random() * maxRange - minRange) // z -500 to 500
        )

        velocities.push(
            Math.floor(Math.random() * 6 - 3) * 0.1, // x -0.3 to 0.3
            Math.floor(Math.random() * 5 + 0.12) * 0.18, // y 0.02 to 0.92
            Math.floor(Math.random() * 6 - 3) * 0.1 // z -0.3 to 0.3
        )
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(snowPositions, 3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    const flakeMaterial = new THREE.PointsMaterial({
        size: 4,
        map: snowTextureLoader.load('code/assets/snowflake.png'),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 1
    });

    particles = new THREE.Points(geometry, flakeMaterial)
    scene.add(particles)
    updatables.push({tick:(_, dt) => updateSnowParticles()})

    function updateSnowParticles() {
        for (let i = 0; i < numSnowFlakes * 3; i += 3) {
            particles.geometry.attributes.position.array[i] -= particles.geometry.attributes.velocity.array[i]
            particles.geometry.attributes.position.array[i+1] -= particles.geometry.attributes.velocity.array[i+1]
            particles.geometry.attributes.position.array[i+2] -= particles.geometry.attributes.velocity.array[i+2] 

            if (particles.geometry.attributes.position.array[i+1] < -10) {
                particles.geometry.attributes.position.array[i] = Math.floor(Math.random()*maxRange - minRange);
                particles.geometry.attributes.position.array[i+1] = Math.floor(Math.random() * maxRange + minHeight); 
                particles.geometry.attributes.position.array[i+2] = Math.floor(Math.random() * maxRange - minRange);  
            }
        }
    
        particles.geometry.attributes.position.needsUpdate = true;

    }
}