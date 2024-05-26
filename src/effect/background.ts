import * as THREE from 'three'

export class Background {
    url;
    scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.url = '../../src/assets/black-bg.png';

        this.init();
    }

    init() {
        const texture = new THREE.TextureLoader().load(this.url);
        console.log('texture.encoding',texture.colorSpace);
        texture.colorSpace = THREE.SRGBColorSpace

        const geometry = new THREE.SphereGeometry( 5000, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: texture
        });

        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.copy({
            x: 0, y: 0, z: 0
        })

        this.scene.add(sphere);
    }
}