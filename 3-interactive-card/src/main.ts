import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Card from "./Card";
import { GUI } from "lil-gui";
import { gsap } from "gsap";

window.addEventListener("load", function () {
  init();
});

function init() {
  const gui = new GUI();

  const COLORS = ["#ff6e6e", "#31e0c1", "#006fff", "#ffd732"];

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  // renderer.setClearAlpha(1);
  // renderer.setClearColor(0x00aaff, 0.5);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // const textureLoader = new THREE.TextureLoader();
  // const texture = textureLoader.load(
  //   "https://images.unsplash.com/photo-1503480207415-fdddcc21d5fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  // );
  // scene.background = texture;

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.z = 25;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  controls.rotateSpeed = 0.75;
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;

  const card = new Card({
    width: 10,
    height: 15.8,
    radius: 0.5,
    color: COLORS[0],
  });

  card.mesh.rotation.z = Math.PI * 0.1;

  scene.add(card.mesh);

  gsap.to(card.mesh.rotation, {
    y: -Math.PI * 4,
    duration: 2.5,
    ease: "back.out(2.5)",
  });

  const cardFolder = gui.addFolder("Card");

  cardFolder
    .add(card.mesh.material, "roughness")
    .min(0)
    .max(1)
    .step(0.01)
    .name("material.roughness");

  cardFolder
    .add(card.mesh.material, "metalness")
    .min(0)
    .max(1)
    .step(0.01)
    .name("material.metalness");

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  ambientLight.position.set(-5, -5, -5);

  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
  const directionalLight2 = directionalLight1.clone();

  directionalLight1.position.set(1, 1, 3);
  directionalLight2.position.set(-1, 1, -3);

  scene.add(directionalLight1, directionalLight2);

  render();

  function render() {
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

  const container = document.querySelector(".container");

  COLORS.forEach((color) => {
    const button = document.createElement("button");
    button.style.backgroundColor = color;
    button.addEventListener("click", () => {
      ([] as THREE.Material[])
        .concat(card.mesh.material)
        .forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color = new THREE.Color(color);
          }
        });

      gsap.to(card.mesh.rotation, {
        y: card.mesh.rotation.y - Math.PI / 2,
        duration: 1,
        ease: "back.out(2.5)",
      });
    });
    container?.appendChild(button);
  });
}
