import { User } from "../../../schema/user/user.model.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import { generateTokens } from "../../../utils/authUtilsJWT/auth.utils.js";

export const userCreateService = async (userData) => {
  const { name, email, phone, password, address } = userData;
  const query = [];
  if (email) query.push({ email: email.toLowerCase().trim() });
  if (phone) query.push({ phone: phone.trim() });
  if (query.length > 0) {
    const existingUser = await User.findOne({ $or: query });
    if (existingUser) {
      throw new AppError("User with this email or phone already exists", 409);
    }
  }

  //new user create
  const newUser = new User({
    name: name.trim(),
    email: email,
    phone: phone,
    password: password,
    address: {
      addressType: address?.addressType || "home",
      addressText: address?.addressText?.trim(),
    },
  });
  // অটো-লগইনের জন্য Access এবং Refresh টোকেন জেনারেট
  const { accessToken, refreshToken } = generateTokens(newUser);
  newUser.refreshToken = refreshToken;
  const savedUser = await newUser.save();
  const userResponse = savedUser.toObject();
  delete userResponse.password; // Remove the password field from the response
  delete userResponse.refreshToken;
  delete userResponse.phone;
  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};
