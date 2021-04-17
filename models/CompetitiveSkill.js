import mongoose from "mongoose";

const competitveSkillSchema = mongoose.Schema({
  ds: { type: Number, required: true, min: 0 },
  algorithms: { type: Number, required: true, min: 0 },
  cpp: { type: Number, required: true, min: 0 },
  java: { type: Number, required: true, min: 0 },
  js: { type: Number, required: true, min: 0 },
  html: { type: Number, required: true, min: 0 },
  python: { type: Number, required: true, min: 0 },
});

export default mongoose.model("Competitive", competitveSkillSchema);
