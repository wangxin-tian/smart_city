import * as THREE from 'three'
import { Points } from './points'
import image from '../../src/assets/rain.png'

export class Rain {
    points;
    constructor(scene: THREE.Scene) {

        this.points = new Points(scene, {
            range: 1000,
            count: 800,
            size: 10,
            opacity: 0.4,
            setPosition(position: Object) {
                Object.assign(position, {
                    speedY: 20,
                })
            },
            setAnimation(position: {
                x: number;
                y: number;
                z: number;
                speedY: number;
            }) {
                position.y -= position.speedY;

                if (position.y <= 0) {
                    position.y = this.range;
                }
            },
            url: image
        })
    }
    
    animation() {
        this.points.animation();
    }
}