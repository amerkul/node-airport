import AirportApplication from './airport-application';
import {userRouter} from './router/user-router';
import {airportRouter} from './router/airport-router';
import {airlineRouter} from './router/airline-router';
import {airplaneRouter} from './router/airplane-router';
import {flightRouter} from './router/flight-router';
import {bookingRouter} from './router/booking-router';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new AirportApplication([
    userRouter.router, 
    airportRouter.router,
    airlineRouter.router,
    airplaneRouter.router,
    bookingRouter.router,
    flightRouter.router
], process.env.SERVER_PORT);
app.listen();