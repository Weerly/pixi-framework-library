import { SceneMapperModule, Type, NavigateToScene } from "./scene-mapper";
import {GameModuleContent} from "../helpers/decorators";
import {initApplication} from "./application";

/**
 * The `ModuleWrapper` class provides a wrapper around a module and offers access to its properties.
 *
 * @template M The type of the module being wrapped.
 */
class ModuleWrapper <M>{
    private readonly properties: GameModuleContent;
    constructor(module: Type<M>) {
        this.properties = <GameModuleContent>module.gameModuleContent;
    }

    /**
     * Retrieves the properties associated with the module.
     *
     * @return {GameModuleContent} The properties of the module.
     */
    get ModuleProperties(): GameModuleContent {
        return this.properties
    }
}

/**
 * Asynchronously loads a game module and initializes its components.
 *
 * @param {Type<M>} module - The game module to be loaded. This module is expected to contain
 *                           properties and methods necessary for game setup and initialization.
 * @return {Promise<void>} A promise that resolves once the game module and its components
 *                         have been successfully initialized.
 */
export async function GameLoader<M>(module: Type<M>): Promise<void> {
    const instance = new ModuleWrapper(module).ModuleProperties;
    await initApplication(instance.appConfiguration);
    new SceneMapperModule(instance.sceneMapper);
    NavigateToScene(instance.startScene);
}