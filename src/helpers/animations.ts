import {Application, Graphics, Renderer, Ticker} from "pixi.js";
import {application} from "../boot";

abstract class AnimationBuilder {
    protected app: Application = application();
    protected constructor(app: Application<Renderer>) {
        this.app = app;
    }

    public runFpsAnimation(fps?: number, callback?: () => void): void {
        this.runAnimation(fps, callback);
    }
    public runTimeAnimation(timeLength: number, callback: () => void): void {
        this.runAnimation(timeLength, callback);
    }
    protected runAnimation(_limit?: any, callback?: () => void): void {
        callback?.call({});
    }
}

export class FadeInBlackAnimationBuilder extends AnimationBuilder {
    private systemFPS: number = 0;
    constructor(app: Application<Renderer>) {
        super(app);
    }

    public runFpsAnimation(fps: number, callback: () => void): void {
        this.systemFPS = this.app.ticker.FPS;
        fps = fps || this.systemFPS;
        const proc = 24 / 100 * fps;
        const res = (60 - (fps - 60))
        const koef = (fps - res) / 60;
        const limit = res + (proc * koef);
        this.app.ticker.maxFPS = fps;
        this.runAnimation(limit, callback);
    }

    public runAnimation(limit: number, callback: () => void): void {
        let time = 0;
        let out_of_time = false;
        this.app.ticker.add(async (delta: Ticker) => {
            time += delta.deltaTime;
            const fadeGraphics = new Graphics()
            this.app.stage.addChild(fadeGraphics)
            fadeGraphics.zIndex = 10007;
            fadeGraphics.blendMode = "multiply";
            fadeGraphics.rect(0, 0, 1024, 1024).fill({color: 0xf0f0f0})
            fadeGraphics.rect(0, 0, 1024, 1024).fill({color: 0x000000, alpha: 0.1})
            if (time > limit) {
                if (!out_of_time) {
                    out_of_time = true;
                    delta.maxFPS = this.systemFPS;
                    delta.minFPS = this.systemFPS;
                    return;
                }
                delta.stop();
                callback();
            }
        });
    }
}