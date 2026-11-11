import { asyncWrapper } from "../../../utils/asyncWrapper/asyncWrapper.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import { apiResponse } from "../../../utils/apiRespons/apiResponse.js";
import { loginService } from "../../../service/user/loginService/loginService.js";

export const loginController = asyncWrapper(async (req, res, next) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    throw new AppError("Email/Phone and password are required", 400);
  }
  const { user } = await loginService(identifier, password);

  res.status(200).json(new apiResponse(200, user, "Success login"));
});
