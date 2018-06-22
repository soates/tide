import { Inject } from '../injector/injector';

@Inject()
export class ErrorService {
    public log(error: any): void {
        console.log(error);
    }
}