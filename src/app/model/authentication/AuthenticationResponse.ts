import { User } from '../User'

export class AuthenticationResponse {
    jwt: string;
    user: User;

    constructor(jwt: string, user: User) {
        this.jwt = jwt;
        this.user = user;
    }
}