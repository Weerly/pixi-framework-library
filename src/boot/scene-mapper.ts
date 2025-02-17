import {GameModuleContent, SceneContent} from "../helpers/decorators";
import {BehaviorSubject, filter, tap} from "rxjs";
import {GameScene} from "../types/scene.types";
import {ClearScene, SceneLoader} from "./scene-loader";

/**
 * Represents a Type interface implementing a generic constructor signature that takes an arbitrary number of arguments.
 *
 * This interface is used to define a structure for a type that can be instantiated with the `new` keyword.
 * Optionally, it can include properties `gameModuleContent` and `sceneContent`, which may hold specific content or metadata.
 *
 * @template T The type of the instance created by the constructor.
 */
export declare interface Type<T> extends Function {
    gameModuleContent?: GameModuleContent;
    sceneContent?: SceneContent;
    new (...args: any[]): T;
}

/**
 * Interface representing a mapper for scenes.
 *
 * The `SceneMapper` interface is used to associate a scene name with its corresponding scene type.
 * It provides a way to declare and map scenes generically.
 *
 * @template T - The type associated with the scene.
 */
export interface SceneMapper<T> {
    sceneName: string;
    scene: Type<T>;
}

/**
 * Represents a navigation function that triggers the scene mapper observable with the specified scene name.
 *
 * @function Navigator
 * @param {string} name - The name of the scene to navigate to.
 * @returns {void}
 */
export const Navigator = (name: string) => {
    SceneMapperObservable.next(name);
}

/**
 * Represents an observable object for the scene mapper, allowing components
 * to subscribe and react to changes in the scene identification string.
 *
 * This observable emits strings representing scene identifiers, and subscribers
 * will receive updates whenever the scene ID changes. It is initialized with a
 * placeholder value of `null` cast as a string.
 *
 * Use this observable to synchronize and manage scene transitions or changes
 * across various components within the application. Being a `BehaviorSubject`,
 * it retains the most recent value and emits it to new subscribers upon subscription.
 */
const SceneMapperObservable = new BehaviorSubject<string>(null as unknown as string)

/**
 * The SceneMapperModule class manages the mapping of game scenes and the dynamic
 * loading and handling of scenes based on incoming events or triggers. It provides
 * functionality to locate, manage, and load game scenes efficiently.
 */
export class SceneMapperModule {
    private sceneMapper: SceneMapper<GameScene>[];

    constructor(sceneMap: SceneMapper<GameScene>[]) {
        this.sceneMapper = sceneMap;
        this.startSceneWatching();
    }

    /**
     * Searches for a scene by its name in the scene mapper and returns the corresponding scene.
     * If the specified scene cannot be found, an error is thrown.
     *
     * @param {string} name - The name of the scene to search for.
     * @return {Type<GameScene>} The scene that matches the given name, if found.
     * @throws {Error} If the scene with the specified name is not found.
     */
    lookingForScene(name: string): Type<GameScene> {
        const scene = this.sceneMapper
            .find((scene) => scene.sceneName === name);
        if (!scene) {
            throw new Error(`Cannot find scene ${name}`);
        } else {
            return scene.scene;
        }
    }

    /**
     * Starts watching for scene changes and handles the loading of scenes based on observed values.
     * The method observes scene-related updates, processes the data, clears the current scene,
     * determines the new scene to load, and triggers the scene loading process.
     *
     * @return {void} Does not return any value.
     */
    startSceneWatching(): void {
        SceneMapperObservable
        .pipe(
            filter(v => v != null),
            tap(v => {
                ClearScene();
                const scene = this.lookingForScene(v);
                SceneLoader(scene).then(() => {});
            })
        )
        .subscribe();
    }
}