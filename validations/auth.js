import { body } from "express-validator";

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть не менее 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avaatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
