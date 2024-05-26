import * as THREE from 'three'
import { color as configColor } from '../config/color'

type optionsType = {
    // 起点
    source: {
        x: number,
        y: number,
        z: number
    },

    // 终点
    target: {
        x: number,
        y: number,
        z: number
    },

    range: number,
    height: number,
    color: string,
    size: number
};

type MyVector3 = {
    x: number;
    y: number;
    z: number;
}

export class Fly {
    scene;
    time;
    constructor(
        scene: THREE.Scene,
        time: { value: number },
        source: MyVector3 = {
            x: 300,
            y: 0,
            z: -200
        },
        target: MyVector3 = {
            x: -500,
            y: 0,
            z: -240
        },
        color: string = configColor.fly
    ) {
        this.scene = scene;
        this.time = time;

        this.createFly({
            // 起点
            source,

            // 终点
            target,

            range: 200,
            height: 300,
            color,
            size: 30
        })
    }

    createFly(options: optionsType) {

        const source = new THREE.Vector3(
            options.source.x,
            options.source.y,
            options.source.z,
        );

        const target = new THREE.Vector3(
            options.target.x,
            options.target.y,
            options.target.z,
        );

        // 通过起点和终点来计算中心位置
        const center = target.clone().lerp(source, 0.5);

        // 设置中心点位置高度
        center.y += options.height;

        // 起点到终点的距离
        const len = parseInt(source.distanceTo(target).toString());

        // 设置贝塞尔曲线运动
        const curve = new THREE.QuadraticBezierCurve3(
            source, center, target
        );

        const points = curve.getPoints(len);

        const positions: number[] = [];
        const aPositions: number[] = [];

        points.forEach((item, index) => {
            positions.push(item.x, item.y, item.z);
            aPositions.push(index);
        });

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('a_position', new THREE.Float32BufferAttribute(aPositions, 1))

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_range: {
                    value: options.range
                },
                u_size: {
                    value: options.size
                },
                u_total: {
                    value: len
                },
                u_time: this.time
            },
            vertexShader: `
                attribute float a_position;

                uniform float u_time;
                uniform float u_size;
                uniform float u_range;
                uniform float u_total;

                varying float v_opacity;

                void main() {
                    float size = u_size;
                    float total_number = u_total * mod(u_time, 1.0);

                    if (total_number > a_position && total_number < a_position + u_range) {

                        // 拖尾效果
                        float index = (a_position + u_range - total_number) / u_range;
                        size *= index;
                        
                        v_opacity = 1.0;
                    } else {
                        v_opacity = 0.0;
                    }

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size / 10.0;
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                varying float v_opacity;

                void main() {
                    gl_FragColor = vec4(u_color, v_opacity);
                }
            `,
            transparent: true
        });

        const point = new THREE.Points(geometry, material);

        this.scene.add(point);
    }
}