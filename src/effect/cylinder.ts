import * as THREE from 'three'

export class Cylinder {
    scene;
    time;
    constructor(scene: THREE.Scene, time: { value: number }) {
        this.scene = scene;
        this.time = time;
    }

    createCylinder(options: {
        isSphere?: boolean,
        geometryParams?: number[],
        radius?: number,
        height: number,
        open: boolean,
        color: string,
        opacity: number,
        position: {
            x: number,
            y: number,
            z: number
        },
        speed: number
    }) {
        let geometry;

        if (options.isSphere && options.geometryParams) {
            geometry = new THREE.SphereGeometry(
                ...options.geometryParams
            );
        } else {
            geometry = new THREE.CylinderGeometry(
                options.radius,
                options.radius,
                options.height,
                32,
                1,
                options.open
            );

            geometry.translate(0, options.height / 2, 0)
        }


        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_height: {
                    value: options.height
                },
                u_opacity: {
                    value: options.opacity
                },
                u_time: this.time,
                u_speed: {
                    value: options.speed
                }
            },
            transparent: true,
            vertexShader: `
            uniform float u_time;
            uniform float u_speed;
            uniform float u_height;
            varying float v_opacity;

            void main() {
                vec3 v_position = position * mod(u_time / u_speed, 1.0);

                v_opacity = mix(1.0, 0.0, position.y / u_height);

                gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
            }
            `,
            fragmentShader: `
            uniform vec3 u_color;
            uniform float u_opacity;
            varying float v_opacity;
            void main() {
                gl_FragColor = vec4(u_color, u_opacity * v_opacity);
            }
            `,
            side: THREE.DoubleSide,
            depthTest: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(options.position);

        this.scene.add(mesh);
    }
}