import { User } from '../api/models';

export default interface UserStripe {
    user: User;
    stripetotal: number;
}