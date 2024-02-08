import { UserModel } from "../models/user.model.js";
import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponseHandler from "../utils/ApiResponseHandler.js";
import bcrypt from "bcrypt";
import { cloudinaryFileHandler } from "../utils/cloudinaryHandler.js";
import jwt from "jsonwebtoken";

// generate accessToken and refreshToken

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    // create new tokens
    let accessToken = user.generateAccessToken();
    let refreshToken = user.generateRefreshToken();

    // save the updated user with new tokens to database

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiErrorHandler(500, "Something went wrong while generate token");
  }
};

// register controller
const registerUser = AsyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const userEmail = await UserModel.findOne({ email });
  if (userEmail) {
    throw new ApiErrorHandler(409, "This Email is already registered");
  }

  const userName = await UserModel.findOne({ username });

  if (userName) {
    throw new ApiErrorHandler(409, "This username is already used");
  }

  const result = await UserModel.create({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashPassword,
    avatar: "",
    coverImage: "",
    refreshToken: "",
  });

  result.save();

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "User Registered Successfully!"));
});

//login controller
const loginUser = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await UserModel.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiErrorHandler(401, "Invalid Credentials!");
  }

  const checkPassword = await user.isCorrectPassword(password);

  if (!checkPassword) {
    throw new ApiErrorHandler(401, "Incorrect username or password!");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedUser = await UserModel.findById(user._id).select(
    "-password -avatar -coverImage -refreshToken -createdTodos -createdAt -updatedAt"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponseHandler(
        200,
        {
          accessToken,
          refreshToken,
          user: loggedUser,
        },
        "Successfully Login"
      )
    );
});

// logout controller

const logoutUser = AsyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponseHandler(200, {}, "Successfully logout"));
});

// upload user avatar

const avatarUploadUser = AsyncHandler(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new ApiErrorHandler(500, "Opps avatar is not found!");
  }

  const avatarProcess = await cloudinaryFileHandler("profile", avatar);

  if (!avatarProcess) {
    throw new ApiErrorHandler(500, "Opps avatar can not upload");
  }

  await UserModel.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatarProcess.url || "" } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Successfully avatar uploaded"));
});

// user info get

const userInfo = AsyncHandler(async (req, res) => {
  const result = await UserModel.findById(req.user._id)
    .populate("blogs")
    .populate("todos")
    .select("-password -refreshToken");

  return res.status(200).json(new ApiResponseHandler(200, result));
});

// expaire new token request

const refreshToken = AsyncHandler(async (req, res) => {
  const incommingRefreshToken = req.cookies.refreshToken || req.body;

  try {
    if (!incommingRefreshToken) {
      throw new ApiErrorHandler(401, "Unauthorize request");
    }

    // check incomming refreshToken SING

    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.JTW_REFRESH_TOKEN_SING
    );

    // check the token id match in our DB user id

    const user = await UserModel.findById(decodedToken._id);

    if (!user) {
      throw new ApiErrorHandler(401, "Invalid refresh token");
    }

    if (user.refreshToken !== incommingRefreshToken) {
      throw new ApiErrorHandler(401, "Invalid or Expaire token");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);
  } catch (err) {
    console.log(err);
    throw new ApiErrorHandler(401, error?.message || "Invalid refresh token");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  avatarUploadUser,
  userInfo,
  refreshToken,
};
