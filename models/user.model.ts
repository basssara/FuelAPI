import { Schema, model } from "mongoose";

interface User {
    email: string;
    password: string;
    isActivated: boolean;
    activationLink: string;
    _id: number
}

const UserSchema = new Schema<User>({
    _id: { type: Number, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
})

const UserModel = model<User>('User', UserSchema)

export default UserModel;