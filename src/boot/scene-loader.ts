import {application, initApplication} from "./application";
import {SceneEventHandler, GameScene, SceneLoopHandler} from "../types/scene.types";
import {Type} from "./scene-mapper";
import {Application, Ticker} from "pixi.js";
import { SceneContent } from "../helpers/decorators";
import {onKeyDown} from "../helpers/event-wrappers";

/**
 * A generic class that acts as a wrapper for a scene module and provides access
 * to its content. The class is designed to work with scenes that have specific
 * content defined in their structure.
 *
 * @template M Represents the type of the module being wrapped.
 */
class SceneWrapper <M>{
    private readonly properties: SceneContent;
    constructor(module: Type<M>) {
        this.properties = <SceneContent>module.sceneContent;
    }

    get SceneContent() {
        return this.properties
    }
}

/**
 * Loads and initializes a game scene.
 *
 * This method runs the provided game scene by creating an application instance,
 * attaching the canvas to the document body, loading required assets, and starting
 * the scene. Additionally, it binds scene events and logs click events on the document.
 *
 * @param {Type<GameScene>} scene - The scene to be loaded and started.
 * @return {Promise<void>} A promise that resolves when the scene has been successfully started.
 */
export async function SceneLoader(scene: Type<GameScene>): Promise<void> {
    const sceneContent = await SceneRunner(scene);
    const sceneApplication= await initializeApplication(scene);

    initializeSceneState(sceneContent, sceneApplication);
    setupClickEvent();
}

/**
 * Removes the HTML element with the name 'canvas' from the document body if it exists.
 * This method is used to clear the scene by deleting the associated canvas element.
 *
 * @return {void} No return value.
 */
export function ClearScene(): void {
    document.body.children.namedItem('canvas')?.remove();
}

/**
 * Encapsulates the logic for initializing the scene state to improve code organization.
 *
 * @param sceneContent The loaded scene content.
 * @param sceneApplication The initialized scene application, cast as a SceneLoopHandler.
 */
function initializeSceneState(
    sceneContent: SceneContent,
    sceneApplication: GameScene
): void {
    const isSetupDefined = 'setup' in sceneApplication;
    const loopHandler = sceneApplication as unknown as SceneLoopHandler;

    if (isSetupDefined) {
        loopHandler.setup?.()
        return;
    }

    if (sceneContent.isTickerOn && !isSetupDefined) {
        const app = application();

        initTicker(app, sceneContent, loopHandler);
        setStateFunction(sceneContent, loopHandler);
    }
}


/**
 * Attaches the given canvas element to the document's body.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to be attached to the document.
 * @return {void} This method does not return a value.
 */
function attachCanvasToDocument(canvas: HTMLCanvasElement): void {
    document.body.appendChild(canvas);
}

/**
 * Initializes a game scene by creating an instance of the provided scene class, loading its assets, and returning the instance.
 *
 * @param {Type<GameScene>} scene - The class type of the game scene to initialize.
 * @param {Application} app - The application instance used for initializing the scene.
 * @return {Promise<GameScene>} A promise that resolves to the initialized game scene instance.
 */
async function initializeScene(scene: Type<GameScene>, app: Application): Promise<GameScene> {
    const sceneInstance = new scene(app);
    await sceneInstance.loadAssets();
    return sceneInstance;
}

/**
 * Binds the event handlers to the specified game scene.
 *
 * @param {GameScene} scene - The game scene to which the event handlers will be bound.
 * @return {void} This method does not return a value.
 */
function bindSceneEvents(scene: GameScene): void {
    SceneEventBinding(scene as unknown as SceneEventHandler);
}

/**
 * Initializes the application by setting up the main scene, loading assets,
 * and starting the scene.
 *
 * @param {Type<GameScene>} scene - The class type of the scene to be initialized.
 *                                   Must extend the `GameScene` class.
 * @return {Promise<Application>} A promise that resolves to the initialized application instance.
 */
async function initializeApplication(scene: Type<GameScene>): Promise<GameScene> {
    const app = application();
    attachCanvasToDocument(app.canvas);

    const sceneInstance = await initializeScene(scene, app);

    bindSceneEvents(sceneInstance);

    await sceneInstance.startScene();
    return sceneInstance;

}

/**
 * Sets up a global click event listener on the document.
 * The event listener logs the event object to the console whenever a click occurs.
 *
 * @return {void} This method does not return a value.
 */
function setupClickEvent(): void {
    document.addEventListener('click', (event) => {
        console.log(event);
    });
}

/**
 * Binds the event handlers of the given SceneEventHandler to keyboard events for directional input.
 *
 * @param {SceneEventHandler} scene - The object containing event handler methods for handling directional inputs such as 'up', 'down', 'left', and 'right'.
 *
 * @return {void} This function does not return a value.
 */
function SceneEventBinding(scene: SceneEventHandler): void {
    if ('upHandler' in scene) {
        try {
            const upHandler = scene.upHandler.bind(scene);
            const downHandler = scene.downHandler.bind(scene);
            const leftHandler = scene.leftHandler.bind(scene);
            const rightHandler = scene.rightHandler.bind(scene);

            document.addEventListener('keydown', (key) => {
                onKeyDown(key, upHandler, downHandler, leftHandler, rightHandler);
            });
        } catch (e) {
            console.error('Error:', e);
        }
    }

}

/**
 * Executes a given scene by initializing its configuration and performing setup tasks.
 *
 * @param {Type<S>} scene - The scene to be executed, which is wrapped in a SceneWrapper to manage scene-specific content and configuration.
 * @return {Promise<void>} A promise that resolves when the scene has been fully executed and initialized.
 */
async function SceneRunner<S>(scene: Type<S>): Promise<SceneContent> {
    const instance = new SceneWrapper(scene).SceneContent;
    await initApplication(instance.config);
    return instance;
}

/**
 * Initializes the ticker for the given scene and instance within the application.
 *
 * This method performs the following actions:
 * - Checks whether a `setup` method is defined in the scene.
 * - If the ticker is enabled and no `setup` method is defined, it tries to add a game loop function
 *   from the instance or scene to the application's ticker.
 * - If a custom game loop function is provided, it will attempt to add it to the ticker.
 * - If the scene implements a default `gameLoop`, it will add it to the ticker's execution.
 * - Updates the scene's `state` if a valid `stateFunction` is defined in the instance.
 *
 * @param {Application} app The application instance managing the game loop and tickers.
 * @param {SceneContent} instance The current scene content instance which holds configuration
 *                                for ticker, game loop, or state function.
 * @param {SceneLoopHandler} scene The scene that may contain custom or default game loop and state logic.
 * @return {void} No value is returned from this method. It modifies the app's ticker and scene configuration directly.
 */
function initTicker(app: Application, instance: SceneContent, scene: SceneLoopHandler): void
{
    /**
     * If Either custom gameLoop function is presented
     * Or scene is implementing SceneLoopHandler then add one of it to the Ticker.
     * But custom gameLoop function is preferable
     */
    if (instance.gameLoopFunction || scene.gameLoop) {
        const gameLoopFunctionName = instance.gameLoopFunction;
        const gameLoopFunction = scene[gameLoopFunctionName as keyof object] as unknown as (delta: Ticker) => void;

        if (gameLoopFunction || scene.gameLoop) {
            // app.ticker.add((delta: Ticker) => (gameLoopFunction ?? scene.gameLoop).bind(scene)(delta));
            addGameLoopToTicker(app, (gameLoopFunction ?? scene.gameLoop).bind(scene))
        }
    } else {
        throw new Error('gameLoop function is missing')
    }
}

/**
 * Updates the state function of a given scene handler based on the provided instance's state function or a default.
 *
 * @param {SceneContent} instance - The instance containing the state function configuration.
 * @param {SceneLoopHandler} scene - The scene loop handler to set the state function for.
 * @return {void} Does not return a value.
 */
function setStateFunction(instance: SceneContent, scene: SceneLoopHandler): void {
    const isSetupDefined = 'setup' in scene;
    if (!isSetupDefined) {
        const stateFunctionName = instance.stateFunction ?? 'play';
        const stateFunction = scene[stateFunctionName as keyof object] as unknown as (delta: Ticker) => void;
        if (stateFunction) {
            scene.state = stateFunction.bind(scene);
        } else {
            throw new Error('state function is missing')
        }
    }
}

/**
 * Adds a game loop function to the application's ticker, ensuring it is called on each tick of the application.
 *
 * @param {Application} app - The application that contains the ticker to which the game loop will be added.
 * @param {function(delta: Ticker): void} gameLoop - The game loop function to be executed on each tick. Receives the delta time as a parameter.
 * @return {void} This method does not return a value.
 */
function addGameLoopToTicker(app: Application, gameLoop: (delta: Ticker) => void): void {
    app.ticker.add((delta: Ticker) => gameLoop(delta));
}