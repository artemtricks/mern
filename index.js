import express from "express";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { loginValidator } from "./validations/login.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controllers/UserControllers.js";
import * as PostController from "./controllers/PostControllers.js";
import { postCreteValidator } from "./validations/create.js";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.lbkkopv.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();
app.use(express.json());
app.post("/auth/login", loginValidator, login);
app.post("/auth/register", registerValidator, register);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreteValidator, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
// app.patch("/posts", PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err, "server error");
  }
  return console.log("Server Ok");
});
