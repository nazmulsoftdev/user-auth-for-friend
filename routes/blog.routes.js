import express from "express";
import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import VerifyJWT from "../middleware/jwt.middleware.js";
const router = express();

router.route("/blog").get(getBlogs).post(VerifyJWT, createBlog);

router.route("/blog/:id").post(VerifyJWT, deleteBlog);

router.route("/blog/:id").put(VerifyJWT, updateBlog);
export default router;
