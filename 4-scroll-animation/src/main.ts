import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "lil-gui";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

window.addEventListener("load", function () {
  init();
});

async function init() {
  gsap.registerPlugin(ScrollTrigger);

  const params = {
    waveColor: "#00ffff",
    backgroundColor: "#ffffff",
    fogColor: "#f0f0f0",
  };

  const gui = new GUI();
  gui.hide();

  const canvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas!,
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);

  // gui.add(scene.fog, "near").min(0).max(100).step(0.1);
  // gui.add(scene.fog, "far").min(100).max(500).step(0.1);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 25, 150);

  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    color: params.waveColor,
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);
  wave.receiveShadow = true;

  wave.rotation.x = -Math.PI / 2;

  const wavePositionAttr = waveGeometry.getAttribute("position");
  const waveHeight = 2.5;
  const initialZPositions: number[] = [];

  for (let i = 0; i < wavePositionAttr.count; i++) {
    const z = wavePositionAttr.getZ(i) + (Math.random() - 0.5) * waveHeight;
    wavePositionAttr.setZ(i, z);
    initialZPositions.push(z);
  }

  const waveUpdate = () => {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < wavePositionAttr.count; i++) {
      const z =
        initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight;
      wavePositionAttr.setZ(i, z);
    }

    wavePositionAttr.needsUpdate = true;
  };

  scene.add(wave);

  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.loadAsync("./models/ship/scene.gltf");

  const ship = gltf.scene;
  ship.castShadow = true;

  ship.traverse((object) => {
    if (object.type === "Mesh") {
      object.castShadow = true;
    }
  });

  ship.rotation.y = Math.PI;
  ship.scale.set(40, 40, 40);

  const shipUpdate = () => {
    const elapsedTime = clock.getElapsedTime();

    ship.position.y = Math.sin(elapsedTime * 3);
  };

  scene.add(ship);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 10;

  pointLight.position.set(15, 15, 15);

  scene.add(pointLight);

  const directionLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionLight.castShadow = true;
  directionLight.shadow.mapSize.width = 1024;
  directionLight.shadow.mapSize.height = 1024;
  directionLight.shadow.radius = 10;

  directionLight.position.set(-15, 15, 15);

  scene.add(directionLight);
  const clock = new THREE.Clock();

  render();

  function render() {
    waveUpdate();
    shipUpdate();

    camera.lookAt(ship.position);

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

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      markers: true,
      scrub: true,
    },
  });

  tl.to(params, {
    waveColor: "#4268ff",
    onUpdate: () => {
      waveMaterial.color = new THREE.Color(params.waveColor);
    },
  })
    .to(
      params,
      {
        backgroundColor: "#2a2a2a",
        onUpdate: () => {
          scene.background = new THREE.Color(params.backgroundColor);
        },
      },
      "<"
    )
    .to(
      params,
      {
        fogColor: "#2f2f2f",
        onUpdate: () => {
          const fog = scene.fog;
          if (fog) fog.color = new THREE.Color(params.fogColor);
        },
      },
      "<"
    );
}
