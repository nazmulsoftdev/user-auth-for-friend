import Todo from "../models/todo.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponseHandler from "../utils/ApiResponseHandler.js";
import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import { UserModel } from "../models/user.model.js";

const getTodo = AsyncHandler(async (req, res) => {
  const result = await Todo.find();

  if (!result?.length > 0) {
    throw new ApiErrorHandler(404, "Database is empty");
  }

  return res.status(200).json(new ApiResponseHandler(200, result));
});

const todoCreate = AsyncHandler(async (req, res) => {
  const { name, email, title, status } = req.body;

  const User = await Todo.findOne({ email });

  if (User) {
    throw new ApiErrorHandler(409, "Opps this email already used !");
  }

  const result = await Todo.create({
    name,
    email,
    title,
    status,
    userInfo: req.user._id,
  });

  const saveResult = await result.save();

  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $push: { todos: saveResult._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Successfully created"));
});

const todoUpdate = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  await Todo.findByIdAndUpdate(id, req.body, { new: true });

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Successfully Updated"));
});

const todoDelete = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);

  await UserModel.findByIdAndUpdate(req.user._id, {
    $pull: { todos: id },
  });

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Deleted Successfully"));
});

export { todoCreate, getTodo, todoUpdate, todoDelete };
