import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import todoRoute from "../routes/todo.routes.js";
import userRoute from "../routes/user.routes.js";
import blogRoute from "../routes/blog.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/", todoRoute);

app.use("/api/v1/", userRoute);
app.use("/api/v1/", blogRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
