import mongoose, { Schema, model } from "mongoose";

// create blog schema
const blogSchema = new Schema(
  {
    blogText: {
      type: String,
      required: true,
    },
    blogFile: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// create blog model

export const blogModel = model("Blog", blogSchema);
