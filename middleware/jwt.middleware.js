import jwt from "jsonwebtoken";
import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { UserModel } from "../models/user.model.js";

const VerifyJWT = AsyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = req.cookies.accessToken || authorization.split(" ")[1];

    if (!token) {
      console.log("Token not found");
      throw new ApiErrorHandler(401, "Unauthorize request");
    }

    const decoded = jwt.verify(token, process.env.JTW_ACCESS_TOKEN_SING);

    const { _id } = decoded;

    const user = await UserModel.findById(_id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiErrorHandler(401, "Invalid accessToken");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiErrorHandler(401, error?.message || "Invalid access token");
  }
});

export default VerifyJWT;
