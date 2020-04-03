import { User } from './User';

export class DepositRequest {
    id: number;
    user: User;
    amount: number;
    requestDate: Date;
    handledDate?: Date;
    accepted: boolean;
}
