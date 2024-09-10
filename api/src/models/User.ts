import mongoose from 'mongoose';

export interface IUser {
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model<IUser>('User', UserSchema);