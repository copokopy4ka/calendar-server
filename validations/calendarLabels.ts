import { body } from "express-validator";

export const calendarLabelCreateValidation = [body("text", "Title is required"), body("color", "Add event date")];

export const calendarLabelUpdateValidation = [
  body("id", "Add team id"),
  body("text", "Title is required").optional(),
  body("color", "Add event date").optional(),
];
