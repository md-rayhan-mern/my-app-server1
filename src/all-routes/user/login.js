import { Router } from "express";
import { loginController } from "../../controller/user/loginController/loginController.js";

export const loginRouter = Router();

loginRouter.post("/login", loginController);
