import { IncomingMessage } from 'http';
import { parse } from 'querystring';

import { Injector, Inject } from '../../injector/injector';
import { RequestHandler, RequestResult } from "./request.handler";

@Inject()
export class PostHandler implements RequestHandler {

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


        let payload: any = '';

        request.on('data', async (data) => {

            payload += data;

            if (payload.length > 1e6) {

                request.connection.destroy();

                throw Error('Size limit reached for POST request');
            }

        });

        return new Promise<RequestResult>((resolve) => {

            request.on('end', async () => {

                payload = JSON.parse(payload);

                type cType = typeof target;

                let ctrl: cType = injector.build<cType>(target);

                let methodResult = await ctrl[method].call(ctrl, { args, payload });

                let result: RequestResult = {
                    data: methodResult
                };

                return resolve(result)

            });
        })


    }

}