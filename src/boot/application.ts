import {Application, ApplicationOptions, Renderer} from "pixi.js";

/**
 * Represents an instance of the Application class with a specific renderer.
 *
 * This variable provides the main entry point for initiating and managing the
 * lifecycle of an application. It encapsulates the rendering context and allows
 * interaction and manipulation of the rendering process.
 *
 * @type {Application<Renderer>}
 */
let App: Application<Renderer> = new Application();

/**
 * Retrieves the current application instance.
 *
 * @function getApplication
 * @returns {Object} The application instance represented by `App`.
 */
const getApplication = () => {
    return App
}

export const appTest = (aa: string) => {
    console.log(aa);
}

/**
 * Initializes the application with the specified configuration options.
 *
 * This asynchronous function creates and initializes a new instance of the Application class.
 * It applies the provided configuration settings and sets the canvas ID to "canvas".
 *
 * @param {Partial<ApplicationOptions>} config - The configuration options for initializing the application. Can include a subset of the ApplicationOptions properties.
 * @returns {Promise<Application>} A promise that resolves with the initialized Application instance.
 */
export const initApplication = async (config:  Partial<ApplicationOptions>): Promise<Application> => {
    App = new Application();
    await App.init(config);
    App.canvas.id = "canvas";
    return App;
}

/**
 * Retrieves the current application instance.
 *
 * This function encapsulates the logic to fetch and return the
 * application. It acts as a wrapper around the `getApplication` method,
 * providing a simplified interface for accessing the application instance.
 *
 * @function
 * @returns {Object} The application instance.
 */
export const application = () => getApplication();
