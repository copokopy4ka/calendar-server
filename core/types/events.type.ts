import mongoose, { Document, Schema } from "mongoose";

export interface EventsModel extends Document {
  id: string;
  ownerId: Schema.Types.ObjectId;
  title: string;
  date: string;
  time: string;
  sequenceNum: number;
  labels: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LabelsModel extends Document {
  id: string;
  text: string;
  color: string;
}

export interface getAllEventsQuery {
  ownerId: mongoose.Types.ObjectId;
  date: {
    $gte: Date;
    $lt: Date;
  };
  title?: {
    $regex: RegExp | string;
    $options?: string;
  };
  labels?: { $in: mongoose.Types.ObjectId[] };
}

export interface LabelToDownload {
  id: string;
  text: string;
  color: string;
}

export interface EventToDownloadDto {
  id: string;
  title: string;
  date: string;
  time: string;
  sequenceNum: number;
  labels: LabelToDownload[];
}

export interface UploadedEventsDto {
  title: string;
  date: string;
  labels: Omit<LabelToDownload, "id">[];
}
