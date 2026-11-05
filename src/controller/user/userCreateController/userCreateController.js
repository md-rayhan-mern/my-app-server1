import { asyncRapper } from "../../../utils/asyncRapper/asyncRapper.js";
import { apiResponse } from "../../../utils/apiRespons/apiResponse.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import { userCreateService } from "../../../service/user/userCreateService/userCreateService.js";

export const userCreateController = asyncRapper(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    password,
    gender,
    role,
    profilePicture,
    birthDate,
  } = req.body;
  const userData = {
    name,
    email,
    phone,
    password,
    gender,
    role,
    profilePicture,
    birthDate,
  };
  if (!name || !email || !phone || !password) {
    return next(
      new AppError(400, "Name, email, phone, and password are required"),
    );
  }
  const newUser = await userCreateService(userData);

  if (!newUser) {
    return next(new AppError(500, "Failed to create user"));
  }
  res
    .status(201)
    .json(new apiResponse(201, newUser, "User created successfully"));
});
