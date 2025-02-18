import {ApplicationOptions} from "pixi.js";
import {SceneMapper, Type} from "../boot";
import {GameScene} from "../types/scene.types";

/**
 * Represents configuration and state information for a scene in an application.
 *
 * @interface SceneContent
 * @property {string} sceneName - The name of the scene.
 * @property {Partial<ApplicationOptions>} config - Configuration options specific to the scene.
 * @property {boolean} [isTickerOn] - Indicates whether the ticker is enabled for the scene. Optional.
 * @property {boolean} [runInnerGameLoop] - Indicates whether the inner game loop is active for the scene. Optional.
 * @property {string} [stateFunction] - The name of the function used for managing the state of the scene. Optional.
 * @property {string} [gameLoopFunction] - The name of the function used for the game loop logic of the scene. Optional.
 */
export interface SceneContent {
    sceneName: string;
    config: Partial<ApplicationOptions>,
    isTickerOn?: boolean,
    runInnerGameLoop?: boolean,
    stateFunction?: string,
    gameLoopFunction?: string,
}

/**
 * Decorator function to assign a SceneContent configuration to a class.
 * It modifies the target class by adding a `sceneContent` property
 * with the specified configuration.
 *
 * @param {SceneContent} args - An object containing properties to define the scene content,
 * including the ticker state and state function.
 * @return {Function} A decorator function to enhance the target class with the specified scene content.
 */
export function sceneContainer(args: SceneContent) {
    return (_target: any) => {
        args.isTickerOn = args.isTickerOn ?? false;
        args.stateFunction = args.stateFunction ?? 'play';

        Object.defineProperty(_target, 'sceneContent', {
            value: args,
            writable: true,
        });
    }
}

/**
 * Represents the content configuration of a game module.
 *
 * The `GameModuleContent` interface defines the primary structure for
 * setting up a game with its initial scene, application options, and
 * mapping of scenes with their respective handlers.
 *
 * @property startScene - A string identifier for the scene that serves as the entry point of the game.
 * @property appConfiguration - A partial configuration object that defines optional application-level settings.
 * @property sceneMapper - An array of scene mappings linking game scenes to their corresponding logic or handling.
 */
export interface GameModuleContent {
    startScene: string;
    appConfiguration: Partial<ApplicationOptions>
    sceneMapper: SceneMapper<GameScene>[]
}

/**
 * Decorator function that assigns the provided game module content to the target class.
 * This function is intended to associate metadata with a class by defining a new property.
 *
 * @param {GameModuleContent} args - The game module content to be assigned to the target class.
 * @return {Function} Returns a decorator function that processes the target class.
 */
export function Module<M>(args: GameModuleContent) {
    return (_target: Type<M>) => {
        Object.defineProperty(_target, 'gameModuleContent', {
            value: args,
            writable: true,
        });
    }
}