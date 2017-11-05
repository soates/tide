
export let Controller: Function = (route: string) => {

    return (target) => {

        let routes = [];

        Object.getOwnPropertyNames(target.prototype).forEach(method => {

            let metaRoutes = Reflect.getMetadata('framework:route', target.prototype[method]);

            if (metaRoutes === undefined) {
                return;
            }

            metaRoutes
                .forEach(meta => {
                    meta.route = `/api/${route}${meta.route === '/' ? '' : meta.route}`;
                    return routes.push({ meta, target, method })
                });

        });

        Reflect.defineMetadata('framework:controller', routes, target);
    };
};

export let Route: Function = (verb: string, route: string) => {

    return (target, key, func) => {

        if (target && key) {

            let routes = Reflect.getMetadata('framework:route', func.value) || [];

            if (routes) {
                routes.push({ verb, route });
            }

            Reflect.defineMetadata('framework:route', routes, func.value);
        }
    };

};

export let Get: Function = (route: string) => {
    return Route('GET', route);
};

export let Post: Function = (route: string) => {
    return Route('POST', route);
};

export let Delete: Function = (route: string) => {
    return Route('DELETE', route);
};
