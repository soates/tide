import { profileAsync } from './../util/profiler';
import { RequestService } from './../request/request.service';
import { RoutingService } from './../routing/routing.service';
import { Injector, Inject } from '../injector/injector';
import { ErrorService } from './error.service';

import * as Http from 'http';

@Inject()
export class ListenerService {

    private errorService: ErrorService;

    private routingService: RoutingService;

    constructor(private state: Injector) {

        this.errorService = this.state.get<ErrorService>(ErrorService);

        this.routingService = this.state.get<RoutingService>(RoutingService);
    }

    public createRequestContext(request: Http.IncomingMessage): Injector {

        const requestInjector = this.state.createChild();

        requestInjector.register<RequestService>(RequestService, { request });

        return requestInjector;

    }

    public async listen(port: number): Promise<any> {

        const server = Http.createServer(async (request, response) => {

            let matchedRoute = this.routingService.resolve(request.method, request.url);

            if (matchedRoute !== null) {

                try {

                    const requestInjector = this.createRequestContext(request);

                    let requestResult = await requestInjector
                        .get<RequestService>(RequestService)
                        .handleRequest(requestInjector, matchedRoute);

                    response.setHeader('Content-Type', 'application/json');

                    response.end(JSON.stringify(requestResult.data));

                } catch (error) {

                    this.errorService.log(error);

                    response.statusCode = 500;

                    response.end();
                }



            } else {

                response.statusCode = 404;

                response.end();

            }

        })

        server.listen(port, (error) => {

            if (error !== undefined) {
                this.errorService.log(error);
            }

            console.log('~Tide: Server Alive');

        });
    }

}