import { RoutingService } from './routing/routing.service';
import { Injector } from './injector/injector';

import { ListenerService } from './services/listener.service';
import { ErrorService } from './services/error.service';
import { buildContainer } from './tide.ioc';

import 'reflect-metadata';

export class TideServer {

    public globalInjector: Injector;

    constructor() {

        this.globalInjector = buildContainer();
    }

    public controllers(controllers: Array<any>): this {

        const router: RoutingService =
            this.globalInjector.get<RoutingService>(RoutingService);

        controllers.forEach(c => {
            router.register(c);
        })

        return this;
    }

    public services(services: Array<any>): this {

        services.forEach(s => {
            this.globalInjector.register<typeof s>(s);
        })

        return this;
    }

    public listen(port: number): this {

        const listener = new ListenerService(this.globalInjector);

        listener.listen(port);

        return this;

    }

}