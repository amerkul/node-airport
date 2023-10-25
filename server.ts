import AirportApplication from './src/airport-application';
import {userRouter} from './src/router/user-router';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new AirportApplication([userRouter.router], process.env.SERVER_PORT);
app.listen();