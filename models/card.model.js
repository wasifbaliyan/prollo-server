const mongoose = require("mongoose");

const { Schema } = mongoose;

const cardSchema = new Schema({
  listId: { type: Schema.Types.ObjectId, ref: "List" },
  boardId: { type: Schema.Types.ObjectId, ref: "Board" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: true,
  },
  description: String,
  priority: {
    type: String,
    default: "low",
  },
  dueDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Card", cardSchema);
