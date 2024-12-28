import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      index: {
        unique: true,
      },
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    joinedAt: {
      type: Date,
    },
    isMigrate: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
