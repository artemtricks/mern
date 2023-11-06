import express from "express";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { loginValidator } from "./validations/login.js";

import { checkAuth, handleValidationError } from "./utils/index.js";
import { PostController, UserController } from "./controllers/index.js";
import { postCreteValidator } from "./validations/create.js";
import multer from "multer";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.lbkkopv.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.post(
  "/auth/login",
  loginValidator,
  handleValidationError,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidator,
  handleValidationError,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreteValidator,
  handleValidationError,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreteValidator,
  handleValidationError,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err, "server error");
  }
  return console.log("Server Ok");
});
