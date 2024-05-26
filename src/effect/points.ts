import * as THREE from 'three'

export class Points {
    scene;
    range;
    count;
    material?: THREE.PointsMaterial;
    geometry?: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
    point?: THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.PointsMaterial, THREE.Object3DEventMap>;
    pointList?: THREE.Vector3[];
    setAnimation;
    setPosition;
    url;
    size;
    opacity;
    constructor(scene: THREE.Scene, { size, opacity, range, count, setAnimation, setPosition, url }: {
        range: number;
        count: number;
        setAnimation: Function;
        setPosition: Function;
        url: string;
        size: number;
        opacity: number;
    }) {
        this.scene = scene;

        // 范围
        this.range = range;

        // 个数
        this.count = count;

        this.size = size;
        this.opacity = opacity;

        this.setAnimation = setAnimation;
        this.setPosition = setPosition;
        this.url = url;

        this.init();
    }

    init() {
        this.material = new THREE.PointsMaterial({
            size: this.size,
            map: new THREE.TextureLoader().load(this.url),
            transparent: true,
            opacity: this.opacity,
            depthTest: false,
        })

        this.geometry = new THREE.BufferGeometry();

        this.pointList = [];
        for (let i = 0; i < this.count; i++) {
            const position: THREE.Vector3 = new THREE.Vector3(
                Math.random() * this.range - this.range / 2,
                Math.random() * this.range,
                Math.random() * this.range - this.range / 2,
            )
            this.setPosition(position)

            this.pointList.push(position);
        }

        this.geometry.setFromPoints(this.pointList);

        this.point = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.point)
    }

    animation() {
        this.pointList?.forEach((position) => {
            this.setAnimation(position)
        })
        this.pointList && this.point?.geometry.setFromPoints(this.pointList)
    }
}