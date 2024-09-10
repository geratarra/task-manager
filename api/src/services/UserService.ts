import { IUser } from "../models/User";
import User from '../models/User';

const bcrypt = require('bcrypt');

export class UserService {
    async createUser({ email, password }: IUser): Promise<IUser> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return newUser;
    }
}