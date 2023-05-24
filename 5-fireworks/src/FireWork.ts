import * as THREE from "three";

interface Props {
  x: number;
  y: number;
}

class FireWork {
  points: THREE.Points;

  constructor({ x, y }: Props) {
    const count = 1000;

    const particlesGeometry = new THREE.BufferGeometry();

    const particles: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);

      particles.push(particle);
    }

    particlesGeometry.setFromPoints(particles);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./assets/textures/particle.png");

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    });

    const points = new THREE.Points(particlesGeometry, particlesMaterial);

    this.points = points;
  }
}

export default FireWork;
