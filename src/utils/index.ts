import { FBXLoader } from 'three/addons'

const fbxLoader = new FBXLoader();
export const loadFBX = (url: string) => {
    return new Promise((resolve, reject) => {
        fbxLoader.load(
            url,
            (object) => resolve(object),
            () => {},
            (error) => reject(error)
        )
    });
};