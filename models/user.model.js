import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// create user schema

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true, // this means that the username must be unique in our database. If someone tries to add a user with an existing username
    },
    email: {
      type: String,
      require: [true, "Please provide an Email address"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      require: true,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate access token by instance method

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.JTW_ACCESS_TOKEN_SING,
    { expiresIn: process.env.JTW_ACCESS_TOKEN_EXPAIRE_TIME }
  );
};

//generate feresh token by instance method

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JTW_REFRESH_TOKEN_SING,
    { expiresIn: process.env.JTW_REFRESH_TOKEN_EXPAIRE_TIME }
  );
};

//  create a model

export const UserModel = model("User", userSchema);
