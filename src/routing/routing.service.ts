var UrlPattern = require('url-pattern');

export class RoutingService {

    private routes: Array<any>;

    constructor() {
        this.routes = [];
    }

    public register(controller) {

        let routes: Array<any> = Reflect.getMetadata('framework:controller', controller);

        this.routes = this.routes.concat(this.routes, routes);
    }


    public resolve(verb, path): any {

        let pattern = new UrlPattern(path)

        let verbRoutes = this.routes.filter(f => f.meta.verb === verb);

        for (let i = 0; i < verbRoutes.length; i++) {
            var route = verbRoutes[i];

            let match = pattern.match(route.meta.route);

            if (match !== null) {
                return { route, args: match };
            }

        }

        return null;
    }

}
