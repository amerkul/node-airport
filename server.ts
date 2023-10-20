import AirportApplication from './src/com/solvd/airport/airport-application';
import {userRouter} from './src/com/solvd/airport/router/user-router';

const app = new AirportApplication([userRouter.router], 3000);
app.listen();