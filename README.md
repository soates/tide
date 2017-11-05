# Tide

No frills node js framework with injector at its core with simple attribute based routing.

## Todo

1. Implement missing verbs
2. Request lifetime injectables
3. Middleware
4. Security

# Example usage

```javascript

>> Controller

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

>> Service

@Inject()
export class TodoService {

    public items: Array<any> = [];

}

>> Server

new TideServer()
    .services([
        TodoService
    ])
    .controllers([
        TodoController
    ])
    .listen(8080);


 

```