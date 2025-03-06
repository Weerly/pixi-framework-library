import {GameScene} from "../types/scene.types";
import {ClearScene, SceneLoader} from "./scene-loader";
import {SceneMapper, Type} from "../types/general.ts";
import {GetGameNavigatorMediator} from "./state-mediator.ts";



/**
 * Represents the currently active scene in the application.
 *
 * This variable holds the name of the active scene as a string,
 * or null if no scene is currently active.
 */
let currentScene: string | null = null;

/**
 * @function ReloadScene
 *
 * ReloadScene function is used to refresh or reload the current scene in an application.
 * If a current scene is active, it navigates to the same scene again by invoking NavigateToScene.
 * This function ensures that the currentScene variable holds a valid reference before performing navigation.
 */
export const ReloadScene = ()=> {
    if (currentScene) {
        NavigateToScene(currentScene);
    }
}

/**
 * Represents a navigation function that triggers the scene mapper observable with the specified scene name.
 *
 * @function NavigateToScene
 * @param {string} name - The name of the scene to navigate to.
 * @returns {void}
 */
export const NavigateToScene = (name: string): void => {
    currentScene = name;
    GetGameNavigatorMediator.update(name);
}

/**
 * The SceneMapperModule class manages the mapping of game scenes and the dynamic
 * loading and handling of scenes based on incoming events or triggers. It provides
 * functionality to locate, manage, and load game scenes efficiently.
 */
export class SceneMapperModule {
    private sceneMapper: SceneMapper<GameScene>[];

    constructor(sceneMap: SceneMapper<GameScene>[]) {
        this.sceneMapper = sceneMap;
        GetGameNavigatorMediator.register(this.getNavigationListener());
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

    getNavigationListener() {
        return {
            sceneNavigation: (sceneName: string)=> {
                ClearScene();
                const scene = this.lookingForScene(sceneName);
                SceneLoader(scene).then(() => {});
            }
        }
    }
}

