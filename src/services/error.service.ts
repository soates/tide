import { Inject } from '../injector/injector';

@Inject()
export class ErrorService {
    public log(error: Error): void {
        console.log(error);
    }
}