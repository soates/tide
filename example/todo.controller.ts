import { Inject } from '../src/tide';
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

    @Get('/:name')
    public async getByName({ name }): Promise<any> {

        return await this.service.items.find(i => i.name === name);
    }

    @Post('/')
    public async post({ payload }): Promise<any> {

        await this.service.items.push(payload);

        return payload;
    }

}