import AuthenticationUserDetails from '../src/com/solvd/airport/security/auth-user-details';
import {authUtil} from '../src/com/solvd/airport/security/auth-util';

const userDetails = new AuthenticationUserDetails('anna', 'anna', 'role');
let token = '';

test('Create token', () => {
    expect(() => {
        token = authUtil.createToken(userDetails);
    }).not.toThrowError();
});

test('Validate token', () => {
    expect(authUtil.validateToken(token))
        .toBe(true);
});