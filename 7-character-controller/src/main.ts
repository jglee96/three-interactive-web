import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

window.addEventListener("load", function () {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 5, 20);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 3;

  const progressBar = document.getElementById("progress-bar");
  const progressBarContainer = document.getElementById(
    "progress-bar-container"
  );

  const loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = (_url, loaded, total) => {
    progressBar?.setAttribute("value", ((loaded / total) * 100).toString());
  };

  loadingManager.onLoad = () => {
    progressBarContainer?.style.setProperty("display", "none");
  };

  const gltfLoader = new GLTFLoader(loadingManager);

  const gltf = await gltfLoader.loadAsync("models/character.gltf");

  const model = gltf.scene;

  model.scale.set(0.1, 0.1, 0.1);

  model.traverse((object) => {
    if (object.type === "Mesh") {
      object.castShadow = true;
    }
  });

  scene.add(model);

  camera.lookAt(model.position);

  const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10000);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7.5;
  plane.receiveShadow = true;

  scene.add(plane);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);

  hemisphereLight.position.set(0, 20, 10);

  scene.add(hemisphereLight);

  const spotLight = new THREE.SpotLight(
    0xffffff,
    5,
    30,
    Math.PI * 0.15,
    0.5,
    0.5
  );

  spotLight.position.set(0, 20, 0);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 8;

  scene.add(spotLight);

  const mixer = new THREE.AnimationMixer(model);
  const hasAnimation = gltf.animations.length !== 0;

  if (hasAnimation) {
    const action = mixer.clipAction(gltf.animations[0]);

    action.play();
  }

  const clock = new THREE.Clock();

  render();

  function render() {
    const delta = clock.getDelta();

    mixer.update(delta);

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
}
