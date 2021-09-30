import UserService from "../service/user.service";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api.errors";

const userService = new UserService

class UserController {
    async registration(req: any, res: any, next: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error at validation'))
            }
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async login(req: any, res: any, next: any) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async logout(req: any, res: any, next: any) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e)
        }
    }

    /*async activate(req: any, res: any, next: any) {
        try {

        } catch (e) {

        }
    }*/

    async refresh(req: any, res: any, next: any) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req: any, res: any, next: any) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e)
        }
    }

}

export default UserController;