import express from "express";
import {
  todoCreate,
  getTodo,
  todoUpdate,
  todoDelete,
} from "../controllers/todo.controller.js";
import VerifyJWT from "../middleware/jwt.middleware.js";
const router = express();

router.route("/todos").post(VerifyJWT, todoCreate).get(VerifyJWT, getTodo);
router
  .route("/todos/:id")
  .put(VerifyJWT, todoUpdate)
  .delete(VerifyJWT, todoDelete);

export default router;
