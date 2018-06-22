import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TideServer } from './../src/tide.server';

import 'reflect-metadata';

export default () =>{

    new TideServer()
        .services([
            TodoService
        ])
        .controllers([
            TodoController
        ])
        .listen(8080);
}
