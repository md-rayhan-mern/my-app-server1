import { Router } from "express";
import {
  loginController,
  refreshTokenController,
  logoutController,
} from "../../controller/user/loginController/loginController.js";
import { verifyJWT } from "../../middleware/authMiddleware/auth.middleware.js";

export const loginRouter = Router();

loginRouter.post("/login", loginController);
loginRouter.post("/refresh-token", refreshTokenController);
loginRouter.post("/logout", verifyJWT, logoutController);
