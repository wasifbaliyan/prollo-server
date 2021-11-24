const express = require("express");
const Board = require("../models/board.model");
const Card = require("../models/card.model");
const List = require("../models/list.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const boards = await Board.find({ userId }).sort({ createdAt: -1 });
    if (!boards) {
      return res.status(404).json({
        message: "Boards not found.",
      });
    }

    res.status(200).json({
      message: "Boards fetched successfully.",
      response: {
        boards,
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

    const board = await new Board({ userId, ...req.body });
    await board.save();
    res.status(201).json({
      message: "Board created successfully.",
      response: {
        board,
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

router.get("/:id", async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user._id;
    let board = await Board.findOne({ userId, _id: boardId })
      .populate("lists")
      .exec();
    if (!board) {
      return res.status(404).json({
        message: "Board not found.",
      });
    }
    // const lists = await List.find({ boardId, userId });
    // board.lists = lists;
    // await board.save();
    res.status(200).json({
      message: "Board fetched successfully.",
      response: {
        board,
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
    const updateBoard = await Board.findOneAndUpdate(
      { userId, _id: req.params.id },
      { ...updatedData, userId },
      { new: true }
    );

    res.status(200).json({
      message: "Board updated successfully.",
      response: {
        updateBoard,
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
    const boardId = req.params.id;
    const userId = req.user._id;
    let board = await Board.findOneAndDelete({ userId, _id: boardId })
      .populate("lists")
      .exec();
    if (!board) {
      return res.status(404).json({
        message: "Board does not exist.",
      });
    }

    res.status(200).json({
      message: "Board deleted successfully.",
      response: {
        board,
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
