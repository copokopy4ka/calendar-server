import * as CalendarEventsController from '../controllers/CalendarEventsController.js';
import * as CalendarLabelsController from '../controllers/CalendarLabelsController.js';
import { ROUTES } from '../consts/routes.js';
import { calendarEventCreateValidation, calendarEventUpdateValidation, calendarEventSequenceNumUpdateValidation, userEventsListValidation } from '../validations/calendarEvent.js';
import { calendarLabelCreateValidation, calendarLabelUpdateValidation } from '../validations/calendarLabels.js';

export const router = (app) => {
	// Download and upload
	app.post(ROUTES.calendar.uploadEvents, userEventsListValidation, CalendarEventsController.uploadUserEvents);
	app.get(ROUTES.calendar.downloadEvents, CalendarEventsController.downloadEvents);
	// Events
  app.get(ROUTES.calendar.getAllEvents, CalendarEventsController.getAllEvents);
  app.post(ROUTES.calendar.createEvent, calendarEventCreateValidation, CalendarEventsController.create);
  app.post(ROUTES.calendar.updateEvent, calendarEventUpdateValidation, CalendarEventsController.update);
  app.post(ROUTES.calendar.updateEventSequenceNum, calendarEventSequenceNumUpdateValidation, CalendarEventsController.updateSequenceNum);
	app.delete(ROUTES.calendar.deleteEvent, CalendarEventsController.deleteEvent);
  app.get(ROUTES.calendar.getEvent, CalendarEventsController.getEvent);
	// Create user
	app.post(ROUTES.calendar.createUser, CalendarEventsController.createUserForCalendarEvents);
	// Labels
	app.get(ROUTES.labels.getAllLabels, CalendarLabelsController.getAllLabels);
  app.post(ROUTES.labels.createLabel, calendarLabelCreateValidation, CalendarLabelsController.create);
  app.post(ROUTES.labels.updateLabel, calendarLabelUpdateValidation, CalendarLabelsController.update);
};
