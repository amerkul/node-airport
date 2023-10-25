import * as express from 'express';
import * as bodyParser from 'body-parser';
import { errorMiddleware } from './middleware/error-middleware';

export default class AirportApplication {
    private app: express.Application;
    private port: Number | string | undefined;

    constructor(routers: Array<any>, port: Number | string | undefined) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeRouters(routers);
        this.handleErrors();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeRouters(routers: Array<any>) {
        routers.forEach(router => this.app.use('/', router));
    }

    private handleErrors() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port);
    }

}
