import { body } from "express-validator";

export const calendarEventCreateValidation = [
  body("title", "Title is required"),
  body("date", "Add event date"),
  body("time", "Must be a string").optional(),
];

export const calendarEventSequenceNumUpdateValidation = [
  body("itemId", "Add event date"),
  body("prevDate", "Must be a date string"),
  body("newDate", "Must be a date string"),
  body("sequenceNum", "Must be a number"),
];

export const calendarEventUpdateValidation = [
  body("id", "Add team id"),
  body("title", "Must be a string").optional(),
  body("date", "Must be a string").optional(),
  body("time", "Must be a string").optional(),
];

export const userEventsListValidation = [
  body("events").isArray().withMessage("Must be an array"),
  body("events.*.title").not().isEmpty().withMessage("title is required"),
  body("events.*.date").not().isEmpty().withMessage("date is required"),
  body("events.*.labels").custom((labels) => {
    if (!Array.isArray(labels)) {
      throw new Error("SubItems must be an array");
    }

    labels.forEach((label, index) => {
      if (!label?.color || !label?.text) {
        throw new Error(`Each label must be an object with an 'text' and 'color' fields`);
      }
    });
    return true;
  }),
];
