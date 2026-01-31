import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

/**
 * GET all tasks
 */
router.get("/getTask", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ created_at: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

/**
 * CREATE task
 */
router.post("/create", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Task title and description required" });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

/**
 * EDIT task
 */
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Task title and description required" });
  }

  try {
    const updated = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        modified: true,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

/**
 * DELETE task
 */
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

router.put("/markComplete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Task.findByIdAndUpdate(
      id,
      {
        status: "completed",
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark task as complete" });
  }
});

export default router;
