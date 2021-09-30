import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import MailService from "./mail.service";
import TokenService from "./token.service";
import UserDto from '../dto/user.dto'
import ApiError from "../exceptions/api.errors";
import { ObjectID } from "bson";

const mailService = new MailService();
const tokenService = new TokenService();

class UserService {
    async registration(email: any, password: any) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
           throw ApiError.BadRequest(`User with this address ${email} already exist`)
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const activationLink = v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, activationLink);

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}

    }

    async login(email: any, password: any) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('User with this email was not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Wrong password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken: any) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken: any) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);//*!!!!*//
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

export default UserService;