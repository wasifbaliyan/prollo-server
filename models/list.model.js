const mongoose = require("mongoose");

const { Schema } = mongoose;

const listSchema = new Schema({
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("List", listSchema);
