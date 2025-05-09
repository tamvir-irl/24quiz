import { Schema, model, models } from "mongoose";

// Define the User schema
const UserSchema = new Schema({
  roll: {
    type: String,
    required: true,
    unique: true, // Ensure roll number is unique
  },
  nickname: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the User model (or use existing one if already created)
const User = models.User || model("User", UserSchema);

export default User;
