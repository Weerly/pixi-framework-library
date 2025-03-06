<h1 align="center">pixi-framework - platform for quick game development</h1>
<p align="center">
  <img src="public/logo.png" alt="angular-logo" width="120px" height="120px"/>
  <br>
  <em>pixi-framework is a development platform for building games for mobile and desktop
    <br> using pixi-JS game engine.</em>
  <br>
</p>
<hr>
<p align="center">
  <a href="https://www.npmjs.com/@weerly_3/pixi-framework">
    <img src="https://img.shields.io/npm/v/@weerly_3/pixi-framework.svg?logo=npm&logoColor=red&label=NPM+package&color=blue&labelColor=white" alt="pixi-framework on npm" />
  </a>&nbsp;
</p>

it's my first try in creating reasonable and helpful tool
I like games and time to time trying myself in game development
Once again taking another js game library ( this time it became an PixiJS) 
I realize that development of more than 1 scene might turn into nightmare.
So my decision was  creating of wrapper ( later I named it pixi-framework as it has framework structure)

Certainly! Here's the complete documentation, including the framework setup. This extended version includes instructions on framework configuration at the beginning, followed by the game scene structure and logic.

---

# Framework and Game Scene Documentation

This document provides step-by-step guidance on setting up the framework and defining game scenes with proper structure and behavior.


## Installation

To install Pixi-Framework, run the following command:

```sh
npm install @weerly_3/pixi-framework
```

Or using yarn:

```sh
yarn add @weerly_3/pixi-framework
```

---

## Framework Setup: Getting Started

To start using the framework, you need to define a **module** and configure the game loader. Below is an example setup that initializes the framework and maps your scenes.

### `GameModule` Configuration

A module uses a decorator to define the configuration of your application, the startup scene, and any scene mappings:

```typescript
import { Module } from "@weerly_3/pixi-framework/helpers/decorators";
import { DefaultBootConfig } from "@weerly_3/pixi-framework/boot/default-boot-config";
import { SceneMapper } from "@weerly_3/pixi-framework/boot/scene-mapper";
import { Scene1 } from "../scenes/Scene1";
import { Scene2 } from "../scenes/Scene2";

const sceneMappings: SceneMapper<any>[] = [
    { sceneName: "Scene 1", scene: Scene1 },
    { sceneName: "Scene 2", scene: Scene2 },
];

@Module({
    startScene: "Scene 1",             // The starting scene when the application initializes
    appConfiguration: DefaultBootConfig, // Default configuration for the application (can be customized)
    sceneMapper: sceneMappings,         // Map of scenes to their names
})
export class GameModule {}
```

### Entry Point: `main.ts`

The entry point of your game initializes the framework and starts loading scenes using a `GameLoader`. Ensure your `GameModule` is properly linked as shown below:

```typescript
import { GameModule } from "./modules/GameModule";
import { GameLoader } from "@weerly_3/pixi-framework/boot";

GameLoader(GameModule).then(() => {
    console.log("Game successfully loaded!");
});
```
The base structure of game project may have look like : 
````
/src
|-- /modules
|   |-- gameModule.ts          // Main configuration module
|-- /scenes                    // Scenes
|   |-- scene1.ts              // 1st scene
|   |-- scene2.ts              // 2nd scene
|   |-- scene3.ts              // 3rd scene
|-- main.ts                    // game's entry point
````

---

## Game Scene Structure

Game scenes are the core building blocks of your game logic. Each scene must implement specific interfaces, can be configured via a decorator, and optionally utilize a game loop (`ticker`).

---

### Overview of Game Scene Behavior

1. **Every scene must implement the `GameScene` interface.**
2. If the game loop (`ticker`) is enabled (`isTickerOn = true`):
    - The scene should implement the `SceneLoopHandler` interface.
    - It must also include the `state(delta: Ticker): void` method, which handles state management.
3. If the `setupTicker` method is defined:
    - It takes over the logic of the game loop, and implementing the `SceneLoopHandler` becomes optional.
4. If no custom ticker logic is provided (`stateFunction`, `gameLoopFunction`, or `setupTicker`), the framework will use default methods for state and game loop.

---

### Required Interfaces

#### 1. `GameScene`

All scenes are required to implement the `GameScene` interface. It provides basic methods for initializing the scene's resources, objects, and startup logic.

```typescript
export interface GameScene {
    loadAssets(): Promise<void>;  // Loads scene resources (e.g., images, sounds)
    fillScene(): Promise<void>;  // Sets up objects within the scene
    startScene(): Promise<void>; // Executes logic when the scene starts
}
```

#### 2. `SceneLoopHandler`

This optional interface is required if `isTickerOn = true` and no `setupTicker` method is present. It handles the game loop and includes the required `state` method.

```typescript
export interface SceneLoopHandler {
    state(delta: Ticker): void;   // Updates the scene's state on each frame
    gameLoop?(delta: Ticker): void; // Main game loop logic (optional, called each frame)
    play?(): void;                 // Called once before the game loop starts (optional)
}
```

---

### Scene Decorator: Parameters

The `@sceneContainer` decorator configures each scene and determines how the game loop behaves:

```typescript
import {sceneContainer} from "./decorators";

@sceneContainer({
    sceneName: string,                      // Name used for scene identification
    config: Partial<ApplicationOptions>,    // Optional custom configuration
    isTickerOn? : boolean,                   // Enables/disables the ticker (default: false)
    stateFunction? : string,                 // Name of the state method (if isTickerOn = true)
    gameLoopFunction? : string,              // Name of the game loop method (if isTickerOn = true)
})
```

---

### Behavior Breakdown: Based on `isTickerOn`

1. **`isTickerOn = false`**:
    - No game loop is executed for this scene.
    - Only the `GameScene` methods (`loadAssets`, `fillScene`, `startScene`) are called.

2. **`isTickerOn = true`**:
    - A game loop (`ticker`) will run during the scene's lifecycle.
    - Depending on the implemented logic:
      | **Condition**                       | **Behavior**                                                  |
      |-------------------------------------|---------------------------------------------------------------|
      | `setupTicker` implemented           | Overrides all other game loop logic.                         |
      | `stateFunction` and `gameLoopFunction` defined | Executes the custom logic defined in these functions.        |
      | Default case                        | Uses `state: (delta) => void` and `gameLoop(delta: Ticker)` if defined. |

---

## Scene Examples

### Example 1: Static Scene Without Game Loop

In this example, the game loop is disabled (`isTickerOn = false`), allowing the scene to operate statically:

```typescript
@sceneContainer({
    sceneName: "StaticScene",
    config: DefaultBootConfig,
})
export class StaticScene implements GameScene {
    async loadAssets() {
        console.log("Loading static scene assets...");
    }

    async fillScene() {
        console.log("Initializing static scene...");
    }

    async startScene() {
        console.log("Starting static scene...");
    }
}
```

---

### Example 2: Scene With Default Game Loop

Here, `isTickerOn = true` enables the game loop, and default methods `state` and `gameLoop` are used:

```typescript
@sceneContainer({
    sceneName: "DefaultLoopScene",
    config: DefaultBootConfig,
    isTickerOn: true,
})
export class DefaultLoopScene implements GameScene, SceneLoopHandler {
    state(delta: Ticker): void {
        console.log("Updating scene state:", delta);
    }

    gameLoop(delta: Ticker): void {
        console.log("Executing main game loop:", delta);
    }

    async loadAssets() {
        console.log("Loading resources for DefaultLoopScene...");
    }

    async fillScene() {
        console.log("Initializing DefaultLoopScene...");
    }

    async startScene() {
        console.log("Starting DefaultLoopScene...");
    }
}
```

---

### Example 3: Scene With Custom Ticker Logic

This example overrides the framework's game loop logic by implementing the `setupTicker` method.

```typescript
@sceneContainer({
    sceneName: "CustomTickerScene",
    isTickerOn: true,
})
export class CustomTickerScene implements GameScene {
    async loadAssets() {
        console.log("Loading assets for CustomTickerScene...");
    }

    async fillScene() {
        console.log("Initializing CustomTickerScene...");
    }

    async startScene() {
        console.log("Starting CustomTickerScene...");
    }

    setupTicker(ticker: any): void {
        ticker.add(() => {
            console.log("Running custom ticker logic...");
        });
    }
}
```

---

### Example 4: Scene With Customized `stateFunction` and `gameLoopFunction`

Using custom state and game loop methods defined in the scene decorator:

```typescript
@sceneContainer({
    sceneName: "CustomLoopScene",
    config: DefaultBootConfig,
    isTickerOn: true,
    stateFunction: "customState",
    gameLoopFunction: "customLoop",
})
export class CustomLoopScene implements GameScene, SceneLoopHandler {
    state = (delta: Ticker) => void 

    customState(delta: Ticker): void {
        console.log("Executing custom state logic:", delta);
    }

    customLoop(delta: Ticker): void {
        console.log("Executing custom game loop logic:", delta);
    }

    async loadAssets() {
        console.log("Loading resources for CustomLoopScene...");
    }

    async fillScene() {
        console.log("Initializing objects for CustomLoopScene...");
    }

    async startScene() {
        console.log("Starting CustomLoopScene...");
    }
}
```

---

## Game Loop Priority (Summary)

| **Condition**                       | **Executed Behavior**                                          |
|-------------------------------------|----------------------------------------------------------------|
| `setupTicker` implemented           | Only `setupTicker` logic is executed.                         |
| `stateFunction` and `gameLoopFunction` defined | Custom methods from the decorator are executed.              |
| Default (`SceneLoopHandler`) behavior | Default `state` + `gameLoop` methods are executed.            |

---

## Conclusion

This documentation explains the setup of the framework, configuration of scenes, and behavior when using a game loop (`ticker`). By following these guidelines, you can create both static and dynamic scenes while fully leveraging the flexibility of the game loop logic.


---

# Scene Switching and Reloading Documentation

---

# Scene Switching

Scene switching is a core functionality of the framework that allows smooth transitions between different scenes during the game's lifecycle. This mechanism enables developers to change scenes dynamically based on user interaction, game state, or other triggers.

---

## How Scene Switching Works

1. Each scene is identified by its **`sceneName`** property, defined in the `@Scene` decorator.
2. The framework includes built-in functionality for dynamically loading and transitioning between scenes.
3. Scene switching is typically achieved using the `SceneManager`, a helper service that manages active and inactive scenes.

---

## SceneManager Methods

The `SceneManager` provides the following key methods for handling scene switches:

### `NavigateToScene(sceneName: string): void`

- **Description**: This method switches the current active scene to a new one by its name.
- **Behavior**:
   - The current scene is unloaded (its resources are optionally cleaned up).
   - The requested scene is loaded and initialized.
   - If the scene cannot be found, an error is logged.
- **Parameters**:
   - `sceneName`: The name of the scene to switch to (must correspond to a mapped scene in the `sceneMapper`).

### `ReloadScene(): void`

- **Description**: This method reloads the currently active scene.
- **Behavior**:
   - The current scene is completely reset (resources are reloaded, objects re-initialized).
   - This functionality is useful for restarting levels or resetting the game state.

---

## Scene Lifecycle During Switching

When switching between scenes, the framework automatically manages their lifecycle. The general steps are:

1. **Unloading the Current Scene**:
   - The current scene’s objects and resources are cleaned up.
   - Custom logic for cleanup can be added in the `startScene` or `fillScene` methods.

2. **Loading the New Scene**:
   - The requested scene is located based on its `sceneName`.
   - Resources are loaded by calling the `loadAssets` method of the new scene.
   - Scene objects are initialized using the `fillScene` method.

3. **Starting the New Scene**:
   - The `startScene` method of the new scene is called to finalize the transition.
   - If the new scene has `isTickerOn = true`, the game loop (`ticker`) begins running automatically.

---

## Example: Switching Between Scenes

Here’s an example of switching from one scene to another using the `SceneManager`:

### Scene 1: Initial Scene

```typescript
@sceneContainer({
    sceneName: "Scene1",
    config: DefaultBootConfig,
    isTickerOn: false, // optional, isTickerOn is false by default
})
export class Scene1 implements GameScene {
    async loadAssets() {
        console.log("Loading assets for Scene1...");
    }

    async fillScene() {
        console.log("Initializing Scene1 objects...");
    }

    async startScene() {
        console.log("Scene1 started.");
        // Triggering scene switch after 3 seconds
        setTimeout(() => {
            NavigateToScene("Scene2");
        }, 3000);
    }
}
```

---

### Scene 2: Target Scene

```typescript
@sceneContainer({
    sceneName: "Scene2",
    config: DefaultBootConfig,
    isTickerOn: true,
})
export class Scene2 implements GameScene, SceneLoopHandler {
    state(delta: Ticker): void {
        console.log("Updating state for Scene2", delta);
    }

    gameLoop(delta: Ticker): void {
        console.log("Executing game loop for Scene2", delta);
    }

    async loadAssets() {
        console.log("Loading assets for Scene2...");
    }

    async fillScene() {
        console.log("Setting up objects for Scene2...");
    }

    async startScene() {
        console.log("Scene2 started!");
    }
}
```

---
# Scene Reloading

## Scene reloading is used to refresh or reload the current scene in an application

## Example: Reloading the Current Scene

The following example shows a restart mechanism where the same scene is reloaded upon user interaction (e.g., pressing a restart button):

```typescript
@sceneContainer({
    sceneName: "GameLevel",
    config: DefaultBootConfig,
    isTickerOn: true,
})
export class GameLevel implements GameScene, SceneLoopHandler {
    state(delta: Ticker): void {
        console.log("Updating game state:", delta);
    }

    gameLoop(delta: Ticker): void {
        console.log("Executing game loop:", delta);
    }

    play(delta: Ticker): void {
     this.restartLevel();
    } 

    async loadAssets() {
        console.log("Loading level assets...");
    }

    async fillScene() {
        console.log("Initializing game level...");
    }

    async startScene() {
        console.log("Game level started!");
    }

    restartLevel() {
        ReloadScene(); // Reloading the current scene
    }
}
```

---

## Scene Switching: Key Features

| **Feature**                   | **Behavior**                                                                 |
|-------------------------------|-------------------------------------------------------------------------------|
| `NavigateToScene`             | Transitions to another scene by `sceneName`, cleaning up the previous scene. |
| `ReloadScene`                 | Reloads the current scene, completely resetting its state.                   |
| Automatic Resource Management | Assets of the previous scene are unloaded during the transition.             |
| Seamless Integration          | New scenes are initialized and started transparently after transition.       |

---

## Best Practices for Scene Switching

1. **Scene Cleanup**:
   - Implement custom cleanup logic (if needed) inside the `startScene` or `fillScene` methods of the current scene before transitioning.

2. **Transition Animations**:
   - Pair scene switching with animations or delays for smoother transitions (e.g., fade-out, fade-in).

3. **Error Handling**:
   - Ensure all scene names provided to `NavigateToScene()` are correctly mapped in the `sceneMapper`.

4. **State Preservation**:
   - If a scene restart is needed but specific data must persist (e.g., player stats), consider manually saving and restoring state.

---

## Conclusion

The framework's **scene switching** mechanism provides robust tools for transitioning between scenes, restarting levels, and managing scene lifecycles efficiently. By leveraging scenes' `sceneName` properties and the helper methods from `SceneManager`, you can create smooth, dynamic gameplay flows.

--- 