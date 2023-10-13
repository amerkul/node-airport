import AirportApplication from './airport-application';
import {userRouter} from './router/user-router';

const app = new AirportApplication([userRouter], 3000);
app.listen();