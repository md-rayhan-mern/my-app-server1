import { asyncWrapper } from "../../../utils/asyncWrapper/asyncWrapper.js";
import { apiResponse } from "../../../utils/apiRespons/apiResponse.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import { userCreateService } from "../../../service/user/userCreateService/userCreateService.js";

export const userCreateController = asyncWrapper(async (req, res, next) => {
  const { name, email, phone, password, gender, profilePicture, birthDate } =
    req.body;
  const userData = {
    name,
    email,
    phone,
    password,
    gender,
    profilePicture,
    birthDate,
  };
  if (!name || !email || !phone || !password) {
    return next(
      new AppError("Name, email, phone, and password are required", 400),
    );
  }
  const newUser = await userCreateService(userData);

  if (!newUser) {
    return next(new AppError("Failed to create user", 500));
  }
  res
    .status(201)
    .json(new apiResponse(201, newUser, "User created successfully"));
});
