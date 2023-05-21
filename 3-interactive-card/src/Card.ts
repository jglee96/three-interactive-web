import * as THREE from "three";

interface Props {
  width: number;
  height: number;
  color: string;
}

class Card {
  public mesh: THREE.Mesh;

  constructor({ width, height, color }: Props) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    this.mesh = mesh;
  }
}

export default Card;
