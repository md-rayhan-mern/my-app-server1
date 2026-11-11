import bcrypt from "bcrypt";
import { User } from "../../../schema/user/userSchema.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";

export const loginService = async (identifier, password) => {
  if (!identifier || !password) {
    throw new AppError("Email/Phone and password are required", 400);
  }
  const cleanIdentifier = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
  }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }
  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
  };
};
