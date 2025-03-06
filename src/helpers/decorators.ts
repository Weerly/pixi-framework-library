import {GameModuleContent, SceneContent} from "../types/decorators.ts";
import {Type} from "../types/general.ts";
import {MetadataProvider} from "./metadata-provider.ts";

/**
 * Decorator function to assign a SceneContent configuration to a class.
 * It modifies the target class by adding a `sceneContent` property
 * with the specified configuration.
 *
 * @param {SceneContent} args - An object containing properties to define the scene content,
 * including the ticker state and state function.
 * @return {Function} A decorator function to enhance the target class with the specified scene content.
 */
export function sceneContainer(args: SceneContent): Function {
    return (_target: any) => {
        args.isTickerOn = args.isTickerOn ?? false;
        args.stateFunction = args.stateFunction ?? 'play';

        MetadataProvider.setSceneContent(_target, args);
    }
}

/**
 * Decorator function that assigns the provided game module content to the target class.
 * This function is intended to associate metadata with a class by defining a new property.
 *
 * @param {GameModuleContent} args - The game module content to be assigned to the target class.
 * @return {Function} Returns a decorator function that processes the target class.
 */
export function Module<M>(args: GameModuleContent): Function {
    return (_target: Type<M>) => {
        MetadataProvider.setGameModuleContent(_target, args);
    }
}