import * as THREE from 'three'
import { Cylinder } from './cylinder'
import { color } from '../config/color'

export class Wall {
    config;
    constructor(scene: THREE.Scene, time: { value: number }) {

        this.config = {
            radius: 50,
            height: 50,
            open: true,
            color: color.wall,
            opacity: 0.6,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            speed: 1.0
        };

        new Cylinder(scene, time).createCylinder(this.config);
    }
}