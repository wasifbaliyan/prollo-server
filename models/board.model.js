const mongoose = require("mongoose");

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "#3182CE",
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Board", boardSchema);
