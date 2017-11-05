import { PostHandler } from './request/handlers/post.handler';
import { GetHandler } from './request/handlers/get.handler';
import { RoutingService } from './routing/routing.service';
import { ErrorService } from './services/error.service';

import { Injector } from "./tide";

export let buildContainer = (): Injector => {

    let globalInjector = new Injector();

    globalInjector.register<ErrorService>(ErrorService);

    globalInjector.register<RoutingService>(RoutingService);

    globalInjector.register<GetHandler>(GetHandler);

    globalInjector.register<PostHandler>(PostHandler);

    return globalInjector;
}