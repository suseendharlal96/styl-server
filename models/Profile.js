import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
  name: { type: String, required: true },
  Image: { type: String, required: true },
  location: { type: String, required: true },
  education: { type: String, required: true },
  challengesSolved: { type: Number, required: true, min: 0 },
  solutionSubmitted: { type: Number, required: true, min: 0 },
  solutionAccepted: { type: Number, required: true, min: 0 },
  rank: { type: Number, required: true, min: 0 },
  followers: { type: Number, required: true, min: 0 },
  following: { type: Number, required: true, min: 0 },
  vote: { type: Number, required: true, min: 0 },
  device: { type: String, required: true },
  competitiveSkills: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competitive",
    required: true,
  },
  createdAt: { type: Date, default: new Date().toISOString() },
});

export default mongoose.model("Profile", profileSchema);
