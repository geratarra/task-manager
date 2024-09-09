const User = require('../models/User');
const bcrypt = require('bcrypt');

interface User {
    email: string;
    password: string;
}

export class UserService {
    async createUser({ email, password }: User) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return newUser;
    }
}