import { useEffect, useState, FormEvent } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  date?: string;
  updated_at?: string;
  modified?: boolean;
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/getTask`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
        setMessage("");
      } else {
        setMessage("Could not load tasks");
      }
    } catch {
      setMessage("Error while loading tasks");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
    setMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!title.trim() || !description.trim()) {
      setMessage("Please fill task title and description.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        editingId
          ? `${API_BASE}/edit/${editingId}`
          : `${API_BASE}/create`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Operation failed");
      } else {
        await getTasks();
        clearForm();
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (t: Task) => {
  if (t.status === "completed") {
    setMessage("Completed tasks cannot be edited.");
    return;
  }

  setEditingId(t._id);
  setTitle(t.title);
  setDescription(t.description);
};


  const markComplete = async (task: Task) => {
    await fetch(`${API_BASE}/markComplete/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: "completed",
      }),
    });

    getTasks();
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t: Task) => {
    const iso = t.updated_at || t.date;
    return iso ? new Date(iso).toLocaleString() : "";
  };

  return (
    <div className="app">
      <h1 className="app-title">My Task Board</h1>

      <div className="layout">
        {/* LEFT SIDE */}
        <div className="left-side">
          <div className="task-card">
            <h2 className="task-title">Task Manager</h2>
            <p className="task-text">
              Simple task manager built with React and Express. Create, edit,
              complete, and delete tasks.
            </p>
          </div>

          <div className="form-card">
            <h3 className="form-heading">
              {editingId ? "Edit Task" : "Add New Task"}
            </h3>

            <form className="task-form" onSubmit={handleSubmit}>
              <input
                className="input"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="textarea"
                placeholder="Task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="form-buttons">
                <button className="btn" disabled={loading}>
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>

            {message && <p className="message">{message}</p>}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-side">
          <div className="tasks-card">
            <div className="tasks-header">
              <h3 className="tasks-title">Tasks</h3>
              <span className="tasks-count">{tasks.length}</span>
            </div>

            {tasks.map((t) => (
              <div
                key={t._id}
                className={`task-item ${
                  t.status === "completed" ? "task-complete" : ""
                }`}
              >
                {/* DELETE ❌ */}
                <button
                  className="task-delete"
                  onClick={() => deleteTask(t._id)}
                  title="Delete task"
                >
                  ✕
                </button>

                <div className="task-top">
                  <span className="task-name">{t.title}</span>
                  <span className="task-meta">
                    {formatTime(t)} {t.modified && "(edited)"}
                  </span>
                </div>

                <p className="task-description">{t.description}</p>

                <div className="task-actions">
                  {t.status !== "completed" && (
                    <>
                      <button
                        className="btn-small"
                        onClick={() => startEdit(t)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-small btn-success"
                        onClick={() => markComplete(t)}
                      >
                        Mark as Complete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
