import * as THREE from 'three'
import { color } from '../config/color'

export class Radar {
    scene;
    time;
    constructor(scene: THREE.Scene, time: { value: number }) {
        this.scene = scene;
        this.time = time;

        this.init();
    }

    init() {
        const raduis = 80;
        const geometry = new THREE.PlaneGeometry(raduis * 2, raduis * 2, 1, 1);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                // 雷达颜色
                u_color: {
                    value: new THREE.Color(color.radarColor)
                },
                // 变化的值
                u_time: this.time,
                // 半径
                u_radius: {
                    value: raduis,
                }
            },

            transparent: true,

            side: THREE.DoubleSide,

            vertexShader: `
            varying vec2 v_position;
            void main() {
                v_position = vec2(position);

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `,

            fragmentShader: `
                precision mediump float;
                varying vec2 v_position;

                uniform float u_time;
                uniform vec3 u_color;
                uniform float u_radius;

                void main() {
                    // 运行的角度
                    float angle = atan(v_position.x, v_position.y);
                    // 雷达的角度
                    float new_angle = mod(angle + u_time, 3.1415926 * 2.0);

                    // 计算距离
                    float dis = distance(vec2(0.0, 0.0), v_position);

                    float borderWidth = 1.0;

                    float f_opacity = 0.0;

                    // 在圆环上
                    if (dis > u_radius - borderWidth) {
                        f_opacity = 1.0;
                    }

                    // 雷达的扫描显示
                    if (dis < u_radius - borderWidth) {
                        f_opacity = 1.0 - new_angle;
                    }

                    // 在圆环外
                    if (dis > u_radius) {
                        f_opacity = 0.0;
                    }

                    gl_FragColor = vec4(u_color, f_opacity);
                }
            `,
        });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotateX(-Math.PI / 2)

        mesh.position.set(300, 2, 0);

        this.scene.add(mesh);
    }
}