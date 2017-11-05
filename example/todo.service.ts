import 'reflect-metadata';

import { Inject } from '../src/tide';

@Inject()
export class TodoService {

    public items: Array<any> = [];

}