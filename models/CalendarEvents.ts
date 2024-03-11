import { Schema, model } from "mongoose";
import { EventsModel } from "../core/types/events.type.js";

const CalendarEventSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "CalendarUser",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sequenceNum: {
      type: Number,
      required: true,
    },
    labels: {
      type: [Schema.Types.ObjectId],
      ref: "EventLabels",
      required: true,
    },
    time: String,
  },
  {
    timestamps: true,
  }
);

export default model<EventsModel>("CalendarEvent", CalendarEventSchema);
