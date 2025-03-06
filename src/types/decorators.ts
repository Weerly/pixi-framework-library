import {ApplicationOptions} from "pixi.js";
import {GameScene} from "./scene.types.ts";
import {Provider} from "./di.ts";
import {SceneMapper} from "./general.ts";

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
    sceneMapper: SceneMapper<GameScene>[],
    providers: Provider[]
}