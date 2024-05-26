import * as THREE from 'three'
import image from '../../src/assets/smoke.png'

export class Smoke {
    scene;
    geometry?: THREE.BufferGeometry;
    material?: THREE.PointsMaterial;
    points?: THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.PointsMaterial, THREE.Object3DEventMap>;
    smokes: {
        x: number,
        y: number,
        z: number,
        opacity: number,
        scale: number,
        size: number,
        speed: {
            x: number,
            y: number,
            z: number,
        }
    }[] = [];
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.init()
    }

    init() {
        // 粒子化缓冲几何体
        this.geometry = new THREE.BufferGeometry();



        this.material = new THREE.PointsMaterial({
            size: 50,
            map: new THREE.TextureLoader().load(image),
            transparent: true,
            depthWrite: false,
        });

        this.material.onBeforeCompile = function(shader) {
            // console.log(shader.vertexShader);

            const vertex1 = `
            attribute float a_opacity;
            attribute float a_size;
            attribute float a_scale;
            varying float v_opacity;

            void main() {
                v_opacity = a_opacity;
            `;

            const glPosition = `
            gl_PointSize = a_size * a_scale;
            `

            shader.vertexShader = shader.vertexShader.replace('void main() {', vertex1);
            shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', glPosition);

            const fragment1 = `
                varying float v_opacity;

                void main() {
            `;
            const fragment2 = `
                gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
            `;

            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment1);
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4(outgoingLight, diffuseColor.a);', fragment2);
        }

        this.points = new THREE.Points(this.geometry, this.material);

        this.scene.add(this.points);
    }

    setAttribute(positionList: number[], opacityList: number[], sizeList: number[], scaleList: number[]) {
        // 坐标信息、纹理信息、变量信息
        this.geometry?.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionList), 3))
        this.geometry?.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array(opacityList), 1))
        this.geometry?.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array(sizeList), 1))
        this.geometry?.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array(scaleList), 1))
    }

    createParticle() {
        this.smokes.push({
            x: -200,
            y: 0,
            z: -400,

            size: 50,
            opacity: 1,
            scale: 1,
            speed: {
                x: Math.random(),
                y: Math.random() + 0.3,
                z: Math.random(),
            }
        })
    }

    update() {
        const positionList: number[] = [];
        const opacityList: number[] = [];
        const sizeList: number[] = [];
        const scaleList: number[] = [];

        // 达到莫一条件抛弃粒子
        this.smokes = this.smokes.filter((item: {
            x: number,
            y: number,
            z: number,
            opacity: number,
            scale: number,
            size: number,
            speed: {
                x: number,
                y: number,
                z: number,
            }
        }) => {
            if (item.opacity < 0) {
                return false;
            }

            item.opacity -= 0.01;
            item.scale += 0.02;
            item.x = item.x + item.speed.x;
            item.y = item.y + item.speed.y;
            item.z = item.z + item.speed.z;

            positionList.push(item.x, item.y, item.z);
            scaleList.push(item.scale)
            sizeList.push(item.size)
            opacityList.push(item.opacity)

            return true;
        })

        this.setAttribute(positionList, opacityList, sizeList, scaleList)
    }

    animation() {
        this.createParticle();
        this.update();
    }
}