const express = require("express");
const Board = require("../models/board.model");
const Card = require("../models/card.model");
const List = require("../models/list.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { listId, boardId } = req.query;
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
    const userId = req.user._id;
    const card = await new Card({
      userId,
      ...req.body,
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

router.put("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;
    const udpatedCard = await Card.findOneAndUpdate(
      { userId, _id: req.params.id },
      { ...updatedData, userId },
      { new: true }
    );

    res.status(200).json({
      message: "Card updated successfully.",
      response: {
        udpatedCard,
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

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const { boardId, listId } = req.query;
    const { id } = req.params;
    const udpatedCard = await Card.findOneAndDelete({
      userId,
      _id: id,
      boardId,
      listId: listId,
    });

    if (!udpatedCard) {
      return res.status(404).json({
        message: "Card does not exist.",
      });
    }
    res.status(200).json({
      message: "Card deleted successfully.",
      response: {
        card: udpatedCard,
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

router.post("/dnd", async (req, res) => {
  try {
    const { droppableListId, draggableListId, draggableCardId, boardId } =
      req.body;
    const userId = req.user._id;
    const found = await Card.findOne({
      userId,
      _id: draggableCardId,
      boardId,
      listId: draggableListId,
    });
    if (!found) {
      return res.status(404).json({
        message: "Card does not exist.",
      });
    }

    const card = await new Card({
      userId,
      listId: droppableListId,
      title: found.title,
      description: found.description,
      boardId,
      dueDate: found.dueDate,
      priority: found.priority,
    });
    await card.save();

    await Card.findOneAndDelete({
      userId,
      _id: draggableCardId,
      boardId,
      listId: draggableListId,
    });

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
