import * as THREE from 'three'
import { Cylinder } from './cylinder'
import { color } from '../config/color'
import { Fly } from './fly';

export class Circle {
    config;
    constructor(scene: THREE.Scene, time: { value: number }) {

        this.config = {
            radius: 50,
            height: 1,
            open: false,
            color: color.circle,
            opacity: 0.6,
            position: {
                x: 300,
                y: 0,
                z: 300
            },
            speed: 2.0
        };

        new Cylinder(scene, time).createCylinder(this.config);

        new Fly(scene, time, {
            x: 300,
            y: 0,
            z: 300
        }, {
            x: -500,
            y: 0,
            z: -240
        }, '#fc36d2')
    }
}