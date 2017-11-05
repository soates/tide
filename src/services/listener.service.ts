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

    public async listen(port: number): Promise<any> {

        const server = Http.createServer(async (request, response) => {

            let matchedRoute = this.routingService.resolve(request.method, request.url);

            if (matchedRoute !== null) {

                const requestInjector = this.state.createChild();

                let requestResult = await profileAsync('Request', async () => {

                    requestInjector.register<RequestService>(RequestService);

                    const reqService: RequestService = requestInjector
                        .get<RequestService>(RequestService);

                    reqService.request = request;

                    return await reqService.handleRequest(requestInjector, matchedRoute);

                })

                response.setHeader('Content-Type', 'application/json');

                response.end(JSON.stringify(requestResult));

            } else {

                response.statusCode = 404;
                response.end();

            }

            console.time("Request End");

        })

        server.listen(port, (error) => {

            if (error !== undefined) {
                this.errorService.log(error);
            }

            console.log('~Tide: Server Alive');

        });
    }

}