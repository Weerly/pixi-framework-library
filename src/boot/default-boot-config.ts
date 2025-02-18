import {ApplicationOptions} from "pixi.js";


/**
 * DefaultBootConfig is a configuration object that defines the default
 * startup options for an application. It specifies essential settings
 * required during the initialization process.
 *
 * Properties:
 * - autoStart: Determines whether the application should automatically start upon initialization.
 * - width: Specifies the default width of the application window.
 * - height: Specifies the default height of the application window.
 */
export const DefaultBootConfig: Partial<ApplicationOptions>  = {
    autoStart: true,
    width: 1024,
    height: 1024
}

