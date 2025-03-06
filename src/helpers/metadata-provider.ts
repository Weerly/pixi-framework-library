import {Type} from "../types/general.ts";
import {GameModuleContent, SceneContent} from "../types/decorators.ts";

const NON_WRITABLE_PROPERTY = false;
const WRITABLE_PROPERTY = true;

export class MetadataProvider {
    public static setSceneContent<T>(_class: Type<T>, value: SceneContent): void {
        this.setProperties(_class, 'sceneContent', value);
    }

    public static setGameModuleContent<T>(_class: Type<T>, value: GameModuleContent): void {
        this.setProperties(_class, 'gameModuleContent', value);
    }

    public static setBlockedKeyValueContent<T, V>(_class: Type<T>, value: V, propertyKey: string): void {
        Object.defineProperty(_class, propertyKey, {
            value,
            writable: NON_WRITABLE_PROPERTY,
        });
    }

    private static setProperties<T, V>(_class: Type<T>, propertyKey: string, value: V): void {
        Object.defineProperty(_class, propertyKey, {
            value,
            writable: WRITABLE_PROPERTY,
        });
    };
}