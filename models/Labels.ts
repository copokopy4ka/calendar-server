import { Schema, model } from "mongoose";
import { LabelsModel } from "../core/types/events.type.js";

const LabelsSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

export default model<LabelsModel>("EventLabels", LabelsSchema);
