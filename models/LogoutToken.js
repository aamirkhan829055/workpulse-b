
import mongoose from "mongoose";

const logoutTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

logoutTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const LogoutToken = mongoose.model(
  "LogoutToken",
  logoutTokenSchema
);

export default LogoutToken;
