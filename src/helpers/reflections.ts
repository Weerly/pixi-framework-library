import { Container, inject, injectable, unmanaged } from 'inversify';
import {Token} from "../types/general.ts";

export const Injectable = injectable;
export const Inject = inject;
export const Unmanaged = unmanaged;


export class ContainerManager {
    private static _container: Container = new Container();

    public static get container(): Container {
        return this._container;
    }

    public static register<T>(identifier: Token, implementation: new (...args: any[]) => T) {
        this._container.bind<T>(identifier).to(implementation);
    }

    public static resolve<T>(identifier: Token): T | undefined {
        return this._container.get<T>(identifier, {optional: true});
    }
}