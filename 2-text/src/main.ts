import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

window.addEventListener("load", function () {
  init();
});

async function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

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

  camera.position.set(0, 1, 5);

  /**
   * control
   */
  new OrbitControls(camera, renderer.domElement);

  /**
   * font
   */
  const fontLoader = new FontLoader();

  /**
   * text
   */
  const font = await fontLoader.loadAsync(
    "./assets/fonts/The Jamsil 3 Regular_Regular.json"
  );
  const textGeometry = new TextGeometry("Three.js Interactive Web", {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  const textMaterial = new THREE.MeshPhongMaterial();

  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.castShadow = true;

  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(
  //     (textGeometry.boundingBox?.max.x ?? 0) -
  //     (textGeometry.boundingBox?.min.x ?? 0)
  //   ) * 0.5,
  //   -(
  //     (textGeometry.boundingBox?.max.y ?? 0) -
  //     (textGeometry.boundingBox?.min.y ?? 0)
  //   ) * 0.5,
  //   -(
  //     (textGeometry.boundingBox?.max.z ?? 0) -
  //     (textGeometry.boundingBox?.min.z ?? 0)
  //   ) * 0.5
  // );
  textGeometry.center();

  /**
   * texture
   */
  const textureLoader = new THREE.TextureLoader().setPath("./assets/textures/");
  const textTexture = textureLoader.load("holographic.jpeg");
  textMaterial.map = textTexture;

  scene.add(text);

  /** plane */
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.position.z = -10;
  plane.receiveShadow = true;
  scene.add(plane);

  /**
   * light
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(
    0xffffff,
    2.5,
    30,
    Math.PI * 0.15,
    0.2,
    0.5
  );

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 10;

  spotLight.position.set(0, 0, 3);
  spotLight.target.position.set(0, 0, -3);
  scene.add(spotLight, spotLight.target);

  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = -(e.clientY / window.innerHeight - 0.5);

    spotLight.target.position.set(x * 5, y * 5, -3);
  });

  const spotLightFolder = gui.addFolder("SpotLight");
  spotLightFolder
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.1);

  spotLightFolder
    .add(spotLight.position, "z")
    .min(1)
    .max(10)
    .step(0.01)
    .name("position.z");

  spotLightFolder.add(spotLight, "distance").min(1).max(30).step(0.01);
  spotLightFolder.add(spotLight, "decay").min(0).max(10).step(0.01);
  spotLightFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01);
  spotLightFolder
    .add(spotLight.shadow, "radius")
    .min(1)
    .max(20)
    .step(0.01)
    .name("shadow.raduis");

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
