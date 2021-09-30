import { Schema, model, ObjectId } from "mongoose";

interface Token {
    refreshToken: string;
    user: object;
}

const TokenSchema = new Schema<Token>({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: {type: String, required: true},
})

const TokenModel = model<Token>('Token', TokenSchema)

export default TokenModel;