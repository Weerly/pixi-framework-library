import {Runner} from "@pixi/runner";
interface IUpdateRunner {
    update: Runner<string>;
}

type EmitListener<T extends string | number | symbol> = Record<T, (arg: any) => void>;

abstract class stateObservable implements IUpdateRunner {
    public update!: Runner;
}

abstract class stateMediator {
    protected constructor(public runner: IUpdateRunner) {}
    public abstract register(listener: EmitListener<string>): void
    public abstract update<T>(data: T): void;
}
class gameNavigationObservable extends stateObservable {
    public update: Runner = new Runner('sceneNavigation');
}

export class GameMediator extends stateMediator {
    public constructor(runner: IUpdateRunner) {
        super(runner);
    }

    public register(listener: EmitListener<string>): void {
        this.runner.update.add(listener);
    }
    public update<T>(data: T): void {
        this.runner.update.emit(data);
    }
}

export const GetGameNavigatorMediator = new GameMediator(new gameNavigationObservable());