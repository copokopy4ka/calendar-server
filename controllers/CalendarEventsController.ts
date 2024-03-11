import { validationResult } from "express-validator";
import { Request, Response } from "express";

import CalendarUserModel from "../models/CalendarUser.js";
import CalendarEventsModel from "../models/CalendarEvents.js";
import LabelsModel from "../models/Labels.js";
import { getDownloadEventsResponse, getEventResponse, getLabelResponse } from "../utils/getDataForResponse.js";
import { EventToDownloadDto, LabelToDownload, UploadedEventsDto } from "../core/types/events.type.js";
import {
  getCurrentDayDateQuery,
  getEventsForCurrentMonthQuery,
  createGetAllEventsQuery,
} from "../utils/createQueryHelpers.js";

export const createUserForCalendarEvents = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      const doc = new CalendarUserModel({ userAgent });
      await doc.save();
    }
    return res.json({ msg: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "User creating failed",
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const body = req.body;
    const date = new Date(body.date);

    const sameDateEventsCount = await CalendarEventsModel.countDocuments(getCurrentDayDateQuery(date));

    const doc = new CalendarEventsModel({ ...body, ownerId: user._id, sequenceNum: sameDateEventsCount });

    const event = await doc.save();
    const responseBody = getEventResponse(event);

    return res.json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Event creating failed",
    });
  }
};

export const updateSequenceNum = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const body = req.body;
    const prevDate = new Date(body.prevDate);
    const newDate = new Date(body.newDate);

    const prevDateEvents = await CalendarEventsModel.find(getCurrentDayDateQuery(prevDate));

    const eventToUpdate = await CalendarEventsModel.findById({ _id: body.itemId });

    if (!eventToUpdate) {
      return res.status(404).json({ msg: `Not found event with id ${body.itemId}` });
    }

    if (prevDate.toISOString().split("T")[0] === newDate.toISOString().split("T")[0]) {
      const filtered = prevDateEvents.filter((el) => el._id.toString() !== eventToUpdate._id.toString());
      filtered.splice(body.sequenceNum, 0, eventToUpdate);

      for (let index = 0; index < filtered.length; index++) {
        const item = filtered[index];
        await CalendarEventsModel.findByIdAndUpdate(item._id, { sequenceNum: index });
      }
    } else {
      eventToUpdate.date = body.newDate;

      const newDateEvents = await CalendarEventsModel.find(getCurrentDayDateQuery(newDate));

      const updatedPrevDateEvents = prevDateEvents.filter((el) => el._id.toString() !== body.itemId);
      newDateEvents.splice(body.sequenceNum, 0, eventToUpdate);

      for (let index = 0; index < updatedPrevDateEvents.length; index++) {
        const item = updatedPrevDateEvents[index];
        await CalendarEventsModel.findByIdAndUpdate(item._id, { sequenceNum: index });
      }

      for (let index = 0; index < newDateEvents.length; index++) {
        const item = newDateEvents[index];
        if (item._id.toString() === eventToUpdate._id.toString()) {
          await CalendarEventsModel.findByIdAndUpdate(item._id, { sequenceNum: index, date: body.newDate });
        }
        await CalendarEventsModel.findByIdAndUpdate(item._id, { sequenceNum: index });
      }
    }

    const responseBody = getEventResponse(eventToUpdate);

    return res.json({ ...responseBody, sequenceNum: body.sequenceNum, date: body.newDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Event creating failed",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const data = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const event = await CalendarEventsModel.findByIdAndUpdate(data.id, data, { new: true });

    if (!event) {
      return res.status(400).json({
        msg: "Event not found",
      });
    }

    res.json(getEventResponse(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Event updating failed",
    });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await CalendarEventsModel.findById(req.params.id);

    if (!event) {
      return res.status(400).json({ msg: "Not found" });
    }

    res.json(getEventResponse(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong fcku",
    });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const date = typeof req.query.date === "string" ? req.query.date : "";
    const currentDate = new Date(date);

    if (isNaN(currentDate.getTime())) {
      return res.status(400).json({ msg: "Invalid date string" });
    }

    const searchText = typeof req.query.searchText === "string" ? req.query.searchText : undefined;
    const labels = typeof req.query.labels === "string" ? req.query.labels : "";

    const events = await CalendarEventsModel.find(createGetAllEventsQuery(user.id, currentDate, labels, searchText));
    const eventsResponse = events.map((event) => getEventResponse(event));

    res.json(eventsResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const status = await CalendarEventsModel.deleteOne({ _id: req.params.id });

    if (!status || !status.deletedCount) {
      return res.status(400).json({ msg: "Deletion failed " });
    }

    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export const downloadEvents = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const date = typeof req.query.date === "string" ? req.query.date : "";
    const currentDate = new Date(date);

    if (isNaN(currentDate.getTime())) {
      return res.status(400).json({ msg: "Invalid date string" });
    }

    const events = await CalendarEventsModel.find(getEventsForCurrentMonthQuery(currentDate));
    const eventsResponse = events.map((event) => getDownloadEventsResponse(event));

    const responseData: EventToDownloadDto[] = [];

    for (const event of eventsResponse) {
      const labels = await LabelsModel.find({ _id: { $in: event.labels } });
      const responseLabels: LabelToDownload[] = labels.map((label) => getLabelResponse(label));
      responseData.push({ ...event, labels: responseLabels });
    }

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export const uploadUserEvents = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const date = typeof req.query.date === "string" ? req.query.date : "";
    const currentDate = new Date(date);

    if (isNaN(currentDate.getTime())) {
      return res.status(400).json({ msg: "Invalid date string" });
    }

    const userEvents: UploadedEventsDto[] = req.body.events;

    await Promise.all(
      userEvents.map(async (event: UploadedEventsDto) => {
        const labelsIds = await Promise.all(
          event.labels.map(async (label) => {
            const newLabel = new LabelsModel(label);
            const savedLabel = await newLabel.save();
            return savedLabel._id;
          })
        );

        const sameDateEventsCount = await CalendarEventsModel.countDocuments(
          getCurrentDayDateQuery(new Date(event.date))
        );

        const newEvent = new CalendarEventsModel({
          ownerId: user.id,
          title: event.title,
          date: event.date,
          sequenceNum: sameDateEventsCount,
          labels: labelsIds,
        });

        return newEvent.save();
      })
    );

    const events = await CalendarEventsModel.find(getEventsForCurrentMonthQuery(currentDate));
    const eventsResponse = events.map((event) => getEventResponse(event));

    res.json(eventsResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};
