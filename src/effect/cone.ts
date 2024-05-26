import * as THREE from 'three'
import { color } from '../config/color'

export class Cone {
    scene;
    top;
    height;
    constructor(scene: THREE.Scene, top: { value: number }, height: { value: number }) {
        this.scene = scene;
        this.top = top;
        this.height = height;

        this.createCone({
            color: color.cone,
            opacity: 0.6,
            position: {
                x: 0,
                y: 50,
                z: 0
            }
        });
    }

    createCone(options: {
        color: string,
        opacity: number,
        position: {
            x: number,
            y: number,
            z: number
        },
    }) {
        let geometry = new THREE.ConeGeometry(
            15,
            30,
            4
        );

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_height: this.height,
                u_opacity: {
                    value: options.opacity
                },
                u_top: this.top
            },
            transparent: true,
            vertexShader: `
            uniform float u_top;
            uniform float u_height;

            void main() {
                float f_angle = u_height / 10.0;
                float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
                float new_y = position.y;
                float new_z = position.x * sin(f_angle) + position.z * cos(f_angle);

                vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);

                gl_Position = projectionMatrix * modelViewMatrix * v_position;
            }
            `,
            fragmentShader: `
            uniform vec3 u_color;
            uniform float u_opacity;
            void main() {
                gl_FragColor = vec4(u_color, u_opacity);
            }
            `,
            side: THREE.DoubleSide,
            depthTest: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(options.position);
        mesh.rotateZ(Math.PI)

        this.scene.add(mesh);
    }
}