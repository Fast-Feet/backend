import { Schema, model, timestamps } from "mongoose";

const DeliveryProblemSchema = new Schema(
  {
    delivery_id: Number,
    description: String,
  },
  { timestamps }
);

export default model("DeliveryProblem", DeliveryProblemSchema);
