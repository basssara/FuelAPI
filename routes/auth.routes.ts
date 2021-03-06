import { Router } from "express";
import { body } from "express-validator";
import UserController from '../controllers/user.controller'
import userMiddleware from '../middlewares/auth.middleware'

const userController = new UserController();

const router = Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 32}),
    userController.registration)
router.post('/login', userController.login);
router.post('/logout', userController.logout);
//router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userMiddleware, userController.getUsers);

export default router;