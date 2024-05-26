import * as THREE from 'three'
import { Cylinder } from './cylinder'
import { color } from '../config/color'
import { Fly } from './fly';

export class Ball {
    config;
    constructor(scene: THREE.Scene, time: { value: number }) {

        this.config = {
            isSphere: true,
            geometryParams: [
                50,
                32,
                32,
                Math.PI / 2,
                Math.PI * 2,
                0,
                Math.PI / 2
            ],
            height: 50,
            open: false,
            color: color.ball,
            opacity: 0.6,
            position: {
                x: 300,
                y: 0,
                z: -200
            },
            speed: 10.0
        };

        new Cylinder(scene, time).createCylinder(this.config);

        new Fly(scene, time);
    }
}