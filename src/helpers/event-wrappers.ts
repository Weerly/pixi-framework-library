import {EventCallBack} from "../types/scene.types";

/**
 * An object mapping control actions to their associated key codes.
 *
 * The `KeyMappings` object defines key bindings for different directional
 * controls such as up, down, left, and right. Each direction is mapped to
 * an array of key codes representing various keys that can perform the
 * same action.
 *
 * Properties:
 * - `up`: Key codes for the 'W' key and the 'Up arrow' key. Used for upward movement.
 * - `down`: Key codes for the 'S' key and the 'Down arrow' key. Used for downward movement.
 * - `left`: Key codes for the 'A' key and the 'Left arrow' key. Used for leftward movement.
 * - `right`: Key codes for the 'D' key and the 'Right arrow' key. Used for rightward movement.
 */
const KeyMappings = {
    up: ['87', '38'], // W Key and Up arrow
    down: ['83', '40'], // S Key and Down arrow
    left: ['65', '37'], // A Key and Left arrow
    right: ['68', '39'] // D Key and Right arrow
};


/**
 * Handles a keyboard event by checking if the pressed key is in the provided list of key codes,
 * and invokes the specified event handler callback if a match is found.
 *
 * @param {KeyboardEvent} key - The keyboard event to be handled.
 * @param {string[]} keyCodes - An array of key codes to be matched against the key event.
 * @param {EventCallBack} handler - The callback function to execute if the key event matches any key code in the list.
 * @return {void} This method does not return a value.
 */
function handleKey(key: KeyboardEvent, keyCodes: string[], handler: EventCallBack) {
    if (keyCodes.includes(key.key)) {
        handler();
    }
}

/**
 * Handles keyboard key down events and triggers the corresponding callback for specific key mappings.
 *
 * @param {KeyboardEvent} key - The keyboard event object representing the key that was pressed.
 * @param {EventCallBack} upHandler - Callback function to handle the "up" key action.
 * @param {EventCallBack} downHandler - Callback function to handle the "down" key action.
 * @param {EventCallBack} leftHandler - Callback function to handle the "left" key action.
 * @param {EventCallBack} rightHandler - Callback function to handle the "right" key action.
 * @return {void} Does not return a value.
 */
export function onKeyDown(
    key: KeyboardEvent,
    upHandler: EventCallBack,
    downHandler: EventCallBack,
    leftHandler: EventCallBack,
    rightHandler: EventCallBack,
): void {
    handleKey(key, KeyMappings.up, upHandler);
    handleKey(key, KeyMappings.down, downHandler);
    handleKey(key, KeyMappings.left, leftHandler);
    handleKey(key, KeyMappings.right, rightHandler);
}