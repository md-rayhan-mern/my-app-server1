import { Router } from "express";
import { userCreateRouter } from "./user/userCreate.js";
import { loginRouter } from "./user/login.js";

export const mainRoute = Router();
const moduleRoutes = [
  {
    path: "/api/v1/",
    router: userCreateRouter,
  },
  {
    path: "/api/v1/",
    router: loginRouter,
  },
];
moduleRoutes.forEach((route) => {
  mainRoute.use(route.path, route.router);
});
