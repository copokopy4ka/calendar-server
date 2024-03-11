import { EventsModel, LabelsModel } from "../core/types/events.type.js";

export const getEventResponse = (dbModelData: EventsModel) => ({
  title: dbModelData.title,
  date: dbModelData.date,
  id: dbModelData._id,
  createdAt: dbModelData.createdAt,
  updatedAt: dbModelData.updatedAt,
  time: dbModelData.time,
  sequenceNum: dbModelData.sequenceNum,
  labels: dbModelData.labels,
});

export const getLabelResponse = (dbModelData: LabelsModel) => ({
  text: dbModelData.text,
  color: dbModelData.color,
  id: dbModelData._id,
});

export const getDownloadEventsResponse = (dbModelData: EventsModel) => ({
  title: dbModelData.title,
  date: dbModelData.date,
  id: dbModelData._id,
  time: dbModelData.time,
  sequenceNum: dbModelData.sequenceNum,
  labels: dbModelData.labels,
});
