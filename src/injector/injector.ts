import { MetaKeys } from './constants';
import { Injectable } from './types';

export class Injector {

    private static current: Injector;

    public static get Current() {

        if (this.current === undefined) {
            this.current = new Injector();
        }
        return this.current;

    }

    private items: Array<Injectable>;

    constructor() {

        this.items = new Array<any>();

    }

    public register<T>(imp: Function, args: any = undefined): void {

        this.items.push(this.registerType(imp, args));

    }

    public get<T>(type: Function): T {

        let candidate = this.items.find(f => f.name === type.name);

        if (candidate === undefined) {
            return undefined;
        }

        if (this.isResolved(candidate)) {
            return candidate.state.instance;
        }

        let meta = Reflect.getMetadata(MetaKeys.PARAMTYPES, candidate.obj);

        if (meta === undefined || meta.length === 0) {
            return this.resolveTypeWithoutParams(candidate);
        }

        return this.resolveTypeWithParams(candidate, meta);

    }

    public build<T>(type: Function, args: any = undefined): T {

        let candidate = {
            name: type.name,
            obj: type,
            args: args,
            state: undefined,
        };

        let meta = Reflect.getMetadata(MetaKeys.PARAMTYPES, candidate.obj);

        if (meta === undefined || meta.length === 0) {
            return this.resolveTypeWithoutParams(candidate);
        }

        return this.resolveTypeWithParams(candidate, meta);
    }

    public createChild(): Injector {

        let child = new Injector();

        child.items = this.items.slice(0);

        return child;

    }

    private isResolved(c: Injectable): boolean {

        return c.state !== undefined && c.state.instance !== undefined;

    }

    private registerType(target: Function, args: any): Injectable {

        return {
            name: target.name,
            obj: target,
            args: args,
            state: undefined,
        };

    }


    private resolveTypeWithParams(candidate: Injectable, deps: Array<any>): any {

        let injectableDeps = deps.filter(d => Reflect.getMetadata(MetaKeys.INJECTABLE, d));

        let args = new Array(injectableDeps.length);

        for (let i = 0; i < injectableDeps.length; i++) {

            let d = injectableDeps[i];

            let injectable = Reflect.getMetadata(MetaKeys.INJECTABLE, d);

            if (injectable === true) {

                let resolved = this.get(d);

                args[i] = resolved;
            }
        }

        let ctor = (cargs: Array<any>) => {

            if (candidate.args === undefined) {
                return new candidate.obj(...cargs);
            }

            Object.keys(candidate.args)
                .forEach(k => cargs.push(candidate.args[k]));

            return new candidate.obj(...cargs);

        }

        candidate.state = {
            instance: ctor(args)
        };

        return candidate.state.instance;

    }

    private resolveTypeWithoutParams(candidate: Injectable): any {

        candidate.state = {
            instance: new candidate.obj(...candidate.args || []),
        };

        this.items[this.items.findIndex(i => i.name === candidate.name)] = candidate;

        return candidate.state.instance;
    }

}

export * from './constants';
export * from './inject-meta';
export * from './injector';
export * from './types';