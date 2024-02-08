import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponseHandler from "../utils/ApiResponseHandler.js";
import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import { blogModel } from "../models/blog.model.js";
import { UserModel } from "../models/user.model.js";
import {
  cloudinaryFileHandler,
  cloudinaryDeleteFileHandler,
  cloudImageFinder,
} from "../utils/cloudinaryHandler.js";

// get all blog post

const getBlogs = AsyncHandler(async (req, res) => {
  const result = await blogModel.find();
  return res.status(200).json(new ApiResponseHandler(200, result));
});

// create blog controller

const createBlog = AsyncHandler(async (req, res) => {
  const { blogText, blogFile, status } = req.body;

  const blogFileProcess = await cloudinaryFileHandler("blogs", blogFile);

  if (!blogFileProcess) {
    throw new ApiErrorHandler(500, "Opps blogFile can not upload");
  }

  const result = await blogModel.create({
    blogText,
    blogFile: blogFileProcess.url || "",
    status,
    author: req.user._id,
  });

  const saveResult = await result.save();

  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $push: { blogs: saveResult._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Successfully Blog created"));
});

// update blog controller

const updateBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await blogModel.odo.findByIdAndUpdate(id, req.body, { new: true });

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Successfully Updated"));
});

// delete blog controller

const deleteBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fileUrl } = req.body;

  const { fileName, whatType } = cloudImageFinder(fileUrl);

  await cloudinaryDeleteFileHandler("blogs", whatType, fileName);

  await blogModel.findByIdAndDelete(id);

  await UserModel.findByIdAndUpdate(req.user._id, { $pull: { blogs: id } });

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Deleted Successfully"));
});

export { createBlog, getBlogs, updateBlog, deleteBlog };
