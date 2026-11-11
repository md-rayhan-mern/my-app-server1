import { User } from "../../../schema/user/userSchema.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";

export const userCreateService = async (userData) => {
  const { name, email, phone, password, gender, profilePicture, birthDate } =
    userData;
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
    gender: gender || "Other",
    profilePicture: profilePicture || "https://placeholder.com",
    birthDate: birthDate || null,
  });

  const savedUser = await newUser.save();
  const userResponse = savedUser.toObject();
  delete userResponse.password; // Remove the password field from the response
  return userResponse;
};
