import AirportApplication from './src/airport-application';
import {userRouter} from './src/router/user-router';

const app = new AirportApplication([userRouter.router], 3000);
app.listen();