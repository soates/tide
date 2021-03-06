import { RequestHandler } from './handlers/request.handler';
import { GetHandler } from './handlers/get.handler';
import { Inject, Injector } from '../injector/injector';
import { IncomingMessage } from 'http';
import { parse } from 'querystring';
import { PostHandler } from './handlers/post.handler';

@Inject()
export class RequestService {

    private handlers;

    constructor(private getHandler: GetHandler,
        private postHandler: PostHandler,
        private request: IncomingMessage) {

        this.handlers = {
            'GET': this.getHandler,
            'POST': this.postHandler
        };

    }

    public async handleRequest(requestInjector: Injector, routeParams): Promise<any> {

        let { route, args } = routeParams;

        let handler: RequestHandler = this.handlers[route.meta.verb];

        if (handler !== undefined) {

            return await handler.handle(this.request,
                requestInjector,
                route.target,
                route.method,
                args);
        }

        throw Error('Unable to handle request');

    }

}