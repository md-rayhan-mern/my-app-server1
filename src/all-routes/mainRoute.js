import { Router } from "express";
import { userCreateRouter } from "./user/userCreate.js";

export const mainRoute = Router();
const moduleRoutes = [
  {
    path: "/api/v1/",
    router: userCreateRouter,
  },
];
moduleRoutes.forEach((route) => {
  mainRoute.use(route.path, route.router);
});
