import jwt from "jsonwebtoken";
import config from "config";
import tokenModel from "../models/token.model";

class TokenService {
    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, config.get('JWT_ACCESS_SECRET'), { expiresIn: '15s' })
        const refreshToken = jwt.sign(payload, config.get('JWT_REFRESH_SECRET'), { expiresIn: '30s' })
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: any) {
        try {
            const userData = jwt.verify(token, config.get('JWT_ACCESS_SECRET'));
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: any) {
        try {
            const userData = jwt.verify(token, config.get('JWT_REFRESH_SECRET'));
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: any, refreshToken: any) {
        const tokenData = await tokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user: userId, refreshToken })
        return token;
    }

    async removeToken(refreshToken: any) {
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData;
    }

    async findToken(refreshToken: any) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }

}

export default TokenService;