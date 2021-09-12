const mongoose = require("mongoose");

const { Schema } = mongoose;

const boardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: true,
  },
  lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

module.exports = mongoose.model("Board", boardSchema);
