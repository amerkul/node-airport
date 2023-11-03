import AuthenticationUserDetails from '../../src/security/auth-user-details';
import {authUtil} from '../../src/security/auth-util';

const userDetails = new AuthenticationUserDetails('anna', 'anna', 'role', 1);
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