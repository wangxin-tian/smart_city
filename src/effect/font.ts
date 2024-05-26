import * as THREE from 'three'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'

export class Font {
    scene;
    font: any;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        const loader = new FontLoader();
        loader.load('/font.json', font => {
            this.font = font;

            // 创建一个字体几何体
            this.createTextQueue();
        })
    }
    createTextQueue() {
        [
            {
                text: '弟皇侠',
                size: 20,
                position: {
                    x: -10,
                    y: 130,
                    z: 410,
                },
                rotate: Math.PI / 1.3,
                color: '#ffffff'
            },
            {
                text: '第二高',
                size: 20,
                position: {
                    x: 180,
                    y: 110,
                    z: -70,
                },
                rotate: Math.PI / 2,
                color: '#ffffff'
            },
        ].forEach(item => {
            this.createText(item)
        });
    }

    createText(data: { text: string; size: number; position: { x: number; y: number; z: number; }; rotate: number; color: string; }) {
        const geometry = new TextGeometry(data.text, {
            font: this.font,
            size: 20,
            depth: 2
        });

        const material = new THREE.ShaderMaterial({
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            `,
        });

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(data.position)

        mesh.rotateY(data.rotate)

        this.scene.add(mesh)
    }
}