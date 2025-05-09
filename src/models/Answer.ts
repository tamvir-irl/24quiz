import { Schema, model, models } from "mongoose";

const answerSchema = new Schema({
  quizId: { type: Number, required: true },
  answer: { type: String, required: true },
  roll: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Answer = models.Answer || model("Answer", answerSchema);

export default Answer;
