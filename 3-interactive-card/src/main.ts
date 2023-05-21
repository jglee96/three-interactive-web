import * as THREE from "three";
import Card from "./Card";

window.addEventListener("load", function () {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  // renderer.setClearAlpha(1);
  // renderer.setClearColor(0x00aaff, 0.5);
  // renderer.setSize(window.innerWidth, window.innerHeight);

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

  const card = new Card({
    width: 10,
    height: 15.8,
    color: "#0077ff",
  });

  scene.add(card.mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  ambientLight.position.set(-5, -5, -5);

  scene.add(ambientLight);

  render();

  function render() {
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
