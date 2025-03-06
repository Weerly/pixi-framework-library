import {SceneManifest, SceneManifestEntry} from "../types/manifest.types.ts";
import {Sprite} from "pixi.js";
import {fillSpriteFromManifest, getSprite} from "./sprite-helpers.ts";
import {MetadataProvider} from "./metadata-provider.ts";



export async function createAndAddToStage(this: any, manifest: SceneManifest) {
    const sprites: Sprite[] = [];
    for (const manifestKey of Object.keys(manifest)) {
        const manifestEntry = manifest[manifestKey] as SceneManifestEntry;
        let sprite: Sprite[] = [];
        if (manifestEntry.loop) {
            sprite = await configureLoopSprites.call(this, manifestKey, manifestEntry);
        } else {
            sprite = [await configureSprite(manifestKey, manifestEntry, this)];
        }
        sprites.push(...sprite);
    }

    return sprites;
}

async function configureLoopSprites(this: any, key: string, manifestEntry: SceneManifestEntry) {
    const sprites: Sprite[] = [];
    for (let i = 0; i < (manifestEntry.loop ?? 0); i++) {
        const sprite: Sprite = await configureSprite(key, manifestEntry, this, i);
        sprites.push(sprite);
    }
    return sprites;
}



async function configureSprite(key: string, manifestEntry: SceneManifestEntry, sceneContext: any, index: number = 1): Promise<Sprite> {
    const { name, schema, isSceneProperty } = manifestEntry;

    const sprite = await getSprite(schema, name);

    fillSpriteFromManifest(sprite, manifestEntry, index);

    // if (loop) {
    //     sprite.zIndex = resolveZIndex(sprite, zIndex);
    //
    //     if (position) {
    //         sprite.position = position;
    //     }
    //
    //     if (points) {
    //         sprite.x = (index * points.x.address) + (points.x?.diff ?? 0);
    //         sprite.y = (index * points.y.address) + (points.y?.diff ?? 0);
    //     }
    // } else {
    //     sprite.zIndex = resolveZIndex(sprite, zIndex);
    //
    //     if (position) {
    //         sprite.position = position;
    //     }
    //
    //     if (points) {
    //         sprite.x = points.x as unknown as number;
    //         sprite.y = points.y as unknown as number;
    //     }
    // }

    if (isSceneProperty) {
        MetadataProvider.setBlockedKeyValueContent(sceneContext, sprite, key);
    }

    return sprite;
}