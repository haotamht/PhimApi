import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});
var Notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "Notification"
);
export default Notification;
