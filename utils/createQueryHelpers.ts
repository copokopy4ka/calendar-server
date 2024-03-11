import mongoose from "mongoose";
import { DateQuery } from "../core/types/common.type.js";
import { getAllEventsQuery } from "../core/types/events.type.js";

export const getEventsDateQuery = (date: Date): DateQuery => {
  const startOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  startOfCurrentMonth.setUTCHours(0, 0, 0, 0);
  const endOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfCurrentMonth.setUTCHours(23, 59, 59, 999);
  const startOfPrevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  startOfPrevMonth.setUTCHours(0, 0, 0, 0);
  const endOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  endOfNextMonth.setUTCHours(23, 59, 59, 999);
  return {
    date: {
      $gte: startOfPrevMonth,
      $lt: endOfNextMonth,
    },
  };
};

export const getCurrentDayDateQuery = (date: Date): DateQuery => {
  date.setUTCHours(0, 0, 0, 0);
  const dateNextDay = new Date(date);
  dateNextDay.setUTCHours(23, 59, 59, 999);
  return {
    date: {
      $gte: date,
      $lt: dateNextDay,
    },
  };
};

export const getEventsForCurrentMonthQuery = (date: Date): DateQuery => {
  const startOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  startOfCurrentMonth.setUTCHours(0, 0, 0, 0);
  const endOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfCurrentMonth.setUTCHours(23, 59, 59, 999);

  return {
    date: {
      $gte: startOfCurrentMonth,
      $lt: endOfCurrentMonth,
    },
  };
};

export const createGetAllEventsQuery = (
  userId: mongoose.Types.ObjectId,
  currentDate: Date,
  labels: string,
  searchText?: string
): getAllEventsQuery => {
  const query: getAllEventsQuery = {
    ownerId: userId,
    ...getEventsDateQuery(currentDate),
  };

  const labelsIds = labels
    ? labels
        .split(",")
        .filter((label) => label)
        .map((id) => new mongoose.Types.ObjectId(id))
    : [];

  if (searchText) {
    query.title = { $regex: searchText, $options: "i" };
  }

  if (labelsIds.length) {
    query.labels = { $in: labelsIds };
  }

  return query;
};
