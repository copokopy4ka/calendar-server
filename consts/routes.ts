export const ROUTES = {
  calendar: {
    getAllEvents: "/api/events",
    getEvent: "/api/events/:id",
    createEvent: "/api/events/create",
    updateEvent: "/api/events/update",
    updateEventSequenceNum: "/api/events/update-sequence-num",
    deleteEvent: "/api/events/:id",
    downloadEvents: "/api/events/download",
    uploadEvents: "/api/events/upload",
    createUser: "/api/user/create",
  },
  labels: {
    getAllLabels: "/api/labels",
    createLabel: "/api/labels/create",
    updateLabel: "/api/labels/update",
  },
};
