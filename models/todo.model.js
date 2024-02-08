import mongoose, { Schema, model } from "mongoose";

// create schema

const todoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"],
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
    },
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// create a model for todoSchema

const Todo = model("Todo", todoSchema);

export default Todo;
