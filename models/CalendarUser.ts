import { model, Schema } from "mongoose";

const CalendarUserSchema = new Schema(
  {
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

export default model("CalendarUser", CalendarUserSchema);
