

/**
 * Checks if the given scene object contains specific event handler properties required for a scene event handler.
 *
 * @param {object} scene - The scene object to be evaluated for event handler properties.
 * @return {boolean} Returns true if the scene object contains all the required event handler properties, otherwise false.
 */
export function isSceneEventHandler(scene: object): boolean {
    const upHandler = scene.hasOwnProperty("upHandler");
    const downHandler = scene.hasOwnProperty("upHandler");
    const leftHandler = scene.hasOwnProperty("downHandler");
    const rightHandler = scene.hasOwnProperty("leftHandler")
    return upHandler && downHandler && leftHandler && rightHandler;
}

/**
 * Checks if a given scene object has a "setup" property defined.
 *
 * @param {object} scene - The scene object to check for the "setup" property.
 * @return {boolean} Returns true if the scene object has a "setup" property, otherwise false.
 */
export function isSceneSetup(scene: object): boolean {
    return scene.hasOwnProperty("setupTicker");
}

/**
 * Checks whether the given scene object contains a "gammeLoop" property,
 * thereby determining if it is part of the game loop.
 *
 * @param {object} scene - The scene object to be checked.
 * @return {boolean} Returns true if the scene object contains a "setup" property; otherwise, false.
 */
export function isSceneGameLoop(scene: object): boolean {
    return scene.hasOwnProperty("gameLoop");
}