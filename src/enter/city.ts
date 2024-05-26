import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { loadFBX } from '../utils';
import { SurroundLine } from '../effect/surroundLine';
// import { Background } from '../effect/background';
import { Radar } from '../effect/radar';
import { Wall } from '../effect/wall';
import { Circle } from '../effect/circle';
import { Ball } from '../effect/ball';
import { Cone } from '../effect/cone';
import { Road } from '../effect/road';
import { Font } from '../effect/font';
import { Snow } from '../effect/snow';
import { Rain } from '../effect/rain';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Smoke } from '../effect/smoke';
import FBX from '../model/beijing.fbx';

declare module 'three' {
    interface Object3D {
        isMesh: boolean;
        geometry: THREE.BufferGeometry
    }
};

export class City {
    scene;
    camera;
    tweenPosition: TWEEN.Tween<THREE.Vector3> | null;
    tweenRotaion: TWEEN.Tween<THREE.Euler> | null;
    height;
    top;
    time;
    flag;
    controls;
    effect: {
        [key: string]: {
            animation: () => void;
        }
    } = {};
    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: OrbitControls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.tweenPosition = null;
        this.tweenRotaion = null;
        this.height = {
            value: 5
        };
        this.flag = true;
        this.top = {
            value: 5
        };
        this.time = {
            value: 0
        }

        this.loadCity();
    }

    loadCity() {
        // 加载模型并渲染到画布
        loadFBX(FBX).then((obj) => {

            // this.scene.add(obj as THREE.Object3D)
            const object = obj as THREE.Object3D;
            object.traverse((child: THREE.Object3D) => {
                if (child.isMesh) {
                    new SurroundLine(this.scene, child, this.height, this.time)
                }
            })

            this.initEffect()
        });
    }

    initEffect() {
        // new Background(this.scene)

        new Radar(this.scene, this.time)

        new Wall(this.scene, this.time)

        new Circle(this.scene, this.time)

        new Ball(this.scene, this.time)

        new Cone(this.scene, this.top, this.height)

        new Road(this.scene, this.time)

        new Font(this.scene)

        this.effect.smoke = new Smoke(this.scene);

        if ((new Date()).getDay() % 2 === 0) 
            this.effect.snow = new Snow(this.scene)
        else 
            this.effect.rain = new Rain(this.scene)

        // 添加点击选择
        // this.addClick();

        this.addWheel();
    }

    addWheel() {
        (document as any).onmousewheel = (event: Event & {
            clientX: number,
            clientY: number,
            wheelDelta: number
        }) => {
            const value = 30;
            
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;

            const vector = new THREE.Vector3(x, y, 0.5);

            vector.unproject(this.camera);

            vector.sub(this.camera.position).normalize();

            if (event.wheelDelta > 0) {
                this.camera.position.x += vector.x * value;
                this.camera.position.y += vector.y * value;
                this.camera.position.z += vector.z * value;

                this.controls.target.x += vector.x * value;
                this.controls.target.y += vector.y * value;
                this.controls.target.z += vector.z * value;
            } else {
                this.camera.position.x -= vector.x * value;
                this.camera.position.y -= vector.y * value;
                this.camera.position.z -= vector.z * value;

                this.controls.target.x -= vector.x * value;
                this.controls.target.y -= vector.y * value;
                this.controls.target.z -= vector.z * value;
            }
        };
    }

    addClick() {
        let flag = true;
        document.onmousedown = () => {
            flag = true;
            document.onmousemove = () => {
                flag = false;
            }
        }

        document.onmouseup = (event: MouseEvent) => {
            if (flag) {
                this.clickEvent(event);
            }
            document.onmousemove = null;
        }
    }

    clickEvent(event: MouseEvent) {
        const _this = this;
        // 获取浏览器坐标
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = - (event.clientY / window.innerHeight) * 2 + 1;

        // 创建设备坐标（三维）
        const standardVector = new THREE.Vector3(x, y, 0.5);

        // 转化为世界坐标
        const worldVector = standardVector.unproject(_this.camera);

        // 做序列化
        const ray = worldVector.sub(_this.camera.position).normalize();

        // 实现点击选中
        // 创建一个射线发射器，用来发射一条射线
        const raycaster = new THREE.Raycaster(_this.camera.position, ray);

        // 返回射线碰撞到的物体
        const intersects = raycaster.intersectObjects(_this.scene.children, true);
        // console.log(intersects)
        let point3d: THREE.Intersection<THREE.Object3D> | null = null;
        if (intersects.length) point3d = intersects[0];
        if (point3d) {
            // 开始动画
            console.log(point3d.point, _this.camera.rotation)
            const time = 2000;
            _this.tweenPosition = new TWEEN.Tween(_this.camera.position).to({
                x: point3d.point.x,
                y: point3d.point.y,
                z: point3d.point.z
            }, time).start();
            _this.tweenRotaion = new TWEEN.Tween(_this.camera.rotation).to({
                x: _this.camera.rotation.x * 0.3,
                y: _this.camera.rotation.y * 0.3,
                z: _this.camera.rotation.z * 0.3
            }, time).start();
        }
    }

    start(delta: number) {
        for (const key in this.effect) {
            this.effect[key] && this.effect[key].animation();
        }

        if (this.tweenPosition && this.tweenRotaion) {
            this.tweenPosition.update();
            this.tweenRotaion.update();
        }

        this.time.value += delta;

        this.height.value += 0.4;
        if (this.height.value > 160) this.height.value = 5;

        if (this.top.value > 15 || this.top.value < 0) {
            this.flag = !this.flag;
        }
        this.top.value += this.flag ? 0.8 : -0.8;
    }
};