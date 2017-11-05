import { IncomingMessage } from 'http';
import { Injector, Inject } from '../../injector/injector';
import { RequestHandler, RequestResult } from "./request.handler";

@Inject()
export class GetHandler implements RequestHandler {

    public async handle(
        request: IncomingMessage,
        injector: Injector,
        target: Function,
        method: string,
        args: any): Promise<RequestResult> {

        if (request === undefined) {
            throw Error('Request required');
        }

        if (injector === undefined) {
            throw Error('Injector required');
        };

        if (target === undefined) {
            throw Error('Target missing');
        };

        if (method === undefined || method === '') {
            throw Error('Method missing');
        };


        let ctrl = injector.build<typeof target>(target);

        let methodResult = await ctrl[method].call(ctrl, args);

        return { data: methodResult };

    }

}