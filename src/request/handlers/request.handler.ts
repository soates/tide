import { Injector } from '../../injector/injector';
import { IncomingMessage } from 'http';

export interface RequestResult {
    data: any
};

export interface RequestHandler {
    handle(request: IncomingMessage, injector: Injector, target: Function, method: string, args: any): Promise<RequestResult>
};