import {ContainerManager} from "../helpers/reflections.ts";
import {Provider} from "../types/di.ts";
import {Token} from "../types/general.ts";


export class InjectorProvider {
    public static setProviders(providers: Provider[]) {
        providers?.forEach(p => {
            ContainerManager.register(p.name, p);
        })
    }

    public static getProvider(token: Token): any {
        return ContainerManager.resolve(token);
    }
}