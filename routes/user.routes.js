import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  avatarUploadUser,
  userInfo,
  refreshToken,
} from "../controllers/user.controller.js";
import VerifyJWT from "../middleware/jwt.middleware.js";

const router = express();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(VerifyJWT, logoutUser);
router.route("/avatar").post(VerifyJWT, avatarUploadUser);
router.route("/userinfo").get(VerifyJWT, userInfo);
router.route("/new-refreshtoken").post(VerifyJWT, refreshToken);

export default router;
