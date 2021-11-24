const express = require("express");

const List = require("../models/list.model");
const Card = require("../models/card.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { boardId } = req.query;
    const userId = req.user._id;
    const lists = await List.find({ boardId, userId }).populate("cards").exec();
    if (!lists) {
      return res.status(404).json({
        message: "Lists not found.",
      });
    }

    res.status(200).json({
      message: "Lists fetched successfully.",
      response: {
        lists,
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

    const list = await new List({ ...req.body, userId });
    await list.save();
    res.status(201).json({
      message: "List created successfully.",
      response: {
        list,
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
    const { boardId } = req.query;
    const listId = req.params.id;
    const userId = req.user._id;
    const list = await List.findOne({ boardId, userId, listId });
    if (!list) {
      return res.status(404).json({
        message: "List not found.",
      });
    }

    const cards = await Card.find({ listId, userId, boardId });
    if (!cards) {
      return res.status(404).json({
        message: "Cards not found.",
      });
    }

    list.cards = cards;
    await list.save();
    res.status(200).json({
      message: "List fetched successfully.",
      response: {
        list,
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
    const listId = req.params.id;
    const userId = req.user._id;
    const { boardId } = req.query;
    let list = await List.findOneAndDelete({ userId, _id: listId, boardId });
    if (!list) {
      return res.status(404).json({
        message: "List does not exist.",
      });
    }
    res.status(200).json({
      message: "List deleted successfully.",
      response: {
        list,
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
