import {Dict, SpritesheetFrameData} from "pixi.js";

/**
 * Represents the parameters necessary to define a rectangle frame.
 *
 * This interface is used to specify the dimensions and position of a frame
 * using x and y coordinates for positioning, along with width and height
 * for its size.
 *
 * Properties:
 * - `x`: The horizontal position of the frame, represented as a number.
 * - `y`: The vertical position of the frame, represented as a number.
 * - `width`: The width of the frame, represented as a numeric value.
 * - `height`: The height of the frame, represented as a numeric value.
 */
export interface IFrameParams {
    x: number;
    width: number;
    y: number;
    height: number }
/**
 * Interface representing a sprite sheet used for 2D animations.
 */
export interface ISpriteSheetDoc {
    frames: Dict<SpritesheetFrameData>;
    meta: { image: string; size: { w: number; h: number }; format: string; scale: string };
    animations?: { frames: string[] }
}