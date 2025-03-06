import {ISpriteSheetDoc} from "./spitesheet.types.ts";

export type pointDetails = {
    address: number;
    diff?: number;
}

export type SceneManifestEntry = {
    name: string;
    zIndex: string | number;
    schema: ISpriteSheetDoc;
    points?: {x: pointDetails, y: pointDetails},
    position?: {x: number, y: number};
    loop?: number;
    isSceneProperty?: boolean;
};

export type SceneManifest = Record<string, SceneManifestEntry>;