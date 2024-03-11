import { validationResult } from "express-validator";
import { Request, Response } from "express";

import CalendarUserModel from "../models/CalendarUser.js";
import LabelsModel from "../models/Labels.js";
import { getLabelResponse } from "../utils/getDataForResponse.js";

export const create = async (req: Request, res: Response) => {
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

    const doc = new LabelsModel(data);

    const label = await doc.save();

    return res.json(getLabelResponse(label));
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

    const label = await LabelsModel.findByIdAndUpdate(data.id, data, { new: true });

    if (!label) {
      return res.status(400).json({
        msg: "Label not found",
      });
    }

    res.json(getLabelResponse(label));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Event updating failed",
    });
  }
};

export const getAllLabels = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];
    const user = await CalendarUserModel.findOne({ userAgent });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const events = await LabelsModel.find();
    const eventsResponse = events.map((event) => getLabelResponse(event));

    res.json(eventsResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};
