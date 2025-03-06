import {GameModuleContent, SceneContent} from "./decorators.ts";

export type Token = string;

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