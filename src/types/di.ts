import {Type} from "./general.ts";


export declare interface TypeProvider extends Type<object> {
}

/**
 * @description
 *
 * Token that can be used to retrieve an instance from an injector or through a query.
 *
 * @publicApi
 */
export type Provider = TypeProvider