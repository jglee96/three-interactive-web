import * as THREE from "three";

interface Props {
  x: number;
  y: number;
}

class FireWork {
  points: THREE.Points;
  particles: THREE.Vector3[];
  deltas: THREE.Vector3[];

  constructor({ x, y }: Props) {
    const count = 1000;
    const velocity = 10 + Math.random() * 10;

    const particlesGeometry = new THREE.BufferGeometry();

    this.particles = [];
    this.deltas = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);
      this.particles.push(particle);

      const delta = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(velocity),
        THREE.MathUtils.randFloatSpread(velocity),
        THREE.MathUtils.randFloatSpread(velocity)
      );
      this.deltas.push(delta);
    }

    particlesGeometry.setFromPoints(this.particles);

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

  update() {
    const position = this.points.geometry.getAttribute("position");

    this.particles.forEach((particle, i) => {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      position.setX(i, x + this.deltas[i].x);
      position.setY(i, y + this.deltas[i].y);
      position.setZ(i, z + this.deltas[i].z);
    });

    position.needsUpdate = true;
  }
}

export default FireWork;
