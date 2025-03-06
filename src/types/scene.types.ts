import {Application, Ticker} from "pixi.js";

/**
 * Represents a callback function that is invoked when an event occurs.
 *
 * The `EventCallBack` type is used to define a function that accepts an optional parameter of type `Event`.
 *
 * @callback EventCallBack
 * @param {Event} [args] - The optional Event object associated with the callback invocation.
 */
export type EventCallBack = (args?: Event) => void;

/**
 * Represents a game scene interface with methods to handle asset loading, scene setup, and scene start behavior.
 */
export interface GameScene {
    app: Application;
    loadAssets(): Promise<void>;
    fillScene(): Promise<void>;
    startScene(): Promise<void>;
}

/**
 * Interface representing a handler for scene-related events.
 *
 * This interface defines event handlers for directional actions
 * (up, down, left, right) and optionally a mouse event handler.
 * Each handler is represented by an `EventCallBack` function type.
 */
export interface SceneEventHandler {
    upHandler: EventCallBack,
    downHandler: EventCallBack,
    leftHandler: EventCallBack,
    rightHandler: EventCallBack,
    mouseHandler?: EventCallBack,
}

/**
 * Interface representing a handler for managing scene loops in a game or application.
 * Provides a structure for defining state management, setup, and main game loop logic.
 *
 * Methods:
 *
 *   - `state(delta: Ticker): void`: Method for handling state updates based on a ticker's delta.
 *     This is typically used for processing game logic operations or any state updates required per frame.
 *
 *   - `setup?(): void`: Optional method for initializing or setting up the scene. Called before the main game loop starts.
 *
 *   - `gameLoop?(delta: Ticker): void`: Optional method for defining the main game loop logic.
 *     Invoked on each frame with a ticker delta to perform rendering, animation updates, or other frame-based operations.
 */
export interface SceneLoopHandler {
    state: (delta: Ticker) => void
    setupTicker?: () => void;
    gameLoop?: (delta: Ticker) => void;
}