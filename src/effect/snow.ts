import * as THREE from 'three'
import { Points } from './points';
import image from '../../src/assets/snow.png';

export class Snow {
    points;
    constructor(scene: THREE.Scene) {

        this.points = new Points(scene, {
            range: 1000,
            count: 800,
            size: 20,
            opacity: 0.8,
            setPosition(position: Object) {
                Object.assign(position, {
                    speedX: Math.random() - 0.5,
                    speedY: Math.random() + 0.8,
                    speedZ: Math.random() - 0.5,
                });
            },
            setAnimation(position: {
                x: number;
                y: number;
                z: number;
                speedX: number;
                speedY: number;
                speedZ: number;
            }) {
                position.x -= position.speedX;
                position.y -= position.speedY;
                position.z -= position.speedZ;

                if (position.y <= 0) {
                    position.y = this.range / 2;
                }
            },
            url: image
        })
    }

    animation() {
        this.points.animation();
    }
}