import { Inject } from './../build/src/injector/inject-meta';
import { Controller, Get, Post } from "../src/tide";
import { TodoService } from "./todo.service";


@Controller('todo')
export class TodoController {

    constructor(private service: TodoService) {
    }

    @Get('/')
    public async get(): Promise<any> {

        return await this.service.items;
    }

    @Post('/')
    public async post({ payload }): Promise<any> {

        await this.service.items.push(payload);

        return payload;
    }

}