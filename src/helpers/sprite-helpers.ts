import {Sprite, Spritesheet, Texture} from "pixi.js";
import {ISpriteSheetDoc} from "../types/spitesheet.types.ts";
import {SceneManifestEntry} from "../types/manifest.types.ts";

export const getSprite = async (spritesheet: ISpriteSheetDoc, name: string) => {

    const spritesheetObject: Spritesheet<ISpriteSheetDoc> = new Spritesheet(
        Texture.from(spritesheet.meta.image),
        spritesheet
    );

    const textures: Record<string, Texture> = await spritesheetObject.parse();
    return new Sprite(textures[name]);
}

export const fillSpriteFromManifest = (sprite: Sprite, manifestEntry: SceneManifestEntry, index: number) => {
    const { zIndex, position, points, loop} = manifestEntry;
    if (loop) {
        sprite.zIndex = resolveZIndex(sprite, zIndex);

        if (position) {
            sprite.position = position;
        }

        if (points) {
            sprite.x = (index * points.x.address) + (points.x?.diff ?? 0);
            sprite.y = (index * points.y.address) + (points.y?.diff ?? 0);
        }
    } else {
        sprite.zIndex = resolveZIndex(sprite, zIndex);

        if (position) {
            sprite.position = position;
        }

        if (points) {
            sprite.x = points.x as unknown as number;
            sprite.y = points.y as unknown as number;
        }
    }
}

function resolveZIndex(sprite: Sprite, zIndex: string | number): number {
    return typeof zIndex === 'string' ? (sprite as any)[zIndex] : zIndex;
};