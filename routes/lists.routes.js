const express = require("express");

const List = require("../models/list.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { boardId } = req.body;
    const userId = req.user._id;
    const lists = await List.find({ boardId, userId });
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
    const { title, boardId } = req.body;
    const userId = req.user._id;

    const list = await new List({ boardId, title, userId });
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

router.delete("/:id", async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user._id;
    const { boardId } = req.body;
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
