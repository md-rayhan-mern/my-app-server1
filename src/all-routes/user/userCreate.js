import { Router } from "express";
import { userCreateController } from "../../controller/user/userCreateController/userCreateController.js";
export const userCreateRouter = Router();
userCreateRouter.post("/cuser", userCreateController);
