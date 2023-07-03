import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  kind: { type: String, require: true },
  episode: [],
  view: { type: Number, require: true },
  ytb_id: { type: String, required: true, unique: true },
});
var Film = mongoose.model("Film", FilmSchema, "Film");
export default Film;
