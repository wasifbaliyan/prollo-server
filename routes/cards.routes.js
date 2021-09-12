const express = require("express");
const Board = require("../models/board.model");
const Card = require("../models/card.model");
const List = require("../models/list.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { listId, boardId } = req.body;
    const userId = req.user._id;

    const cards = await Card.find({ listId, boardId, userId });
    if (!cards) {
      return res.status(404).json({
        message: "Cards not found.",
      });
    }

    res.status(200).json({
      message: "Cards fetched successfully.",
      response: {
        cards,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { boardId, listId, title, description } = req.body;
    const userId = req.user._id;
    const card = await new Card({
      userId,
      boardId,
      listId,
      title,
      description,
    });
    await card.save();
    res.status(201).json({
      message: "Card created successfully.",
      response: {
        card,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

module.exports = router;
