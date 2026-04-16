import { useState, useRef } from "react";

const TAGS = ["none", "work", "personal", "urgent"];
const TAG_LABELS = { none: "—", work: "Work", personal: "Personal", urgent: "Urgent" };

const SEED_TASKS = [
  { id: 1, text: "Review project proposal", done: false, tag: "work" },
  { id: 2, text: "Buy groceries for the week", done: false, tag: "personal" },
  { id: 3, text: "Fix login page bug", done: true, tag: "urgent" },
  { id: 4, text: "Read 20 pages of current book", done: false, tag: "personal" },
];

const TAG_STYLES = {
  work:     { background: "#DBEAFE", color: "#1E40AF" },
  personal: { background: "#DCFCE7", color: "#166534" },
  urgent:   { background: "#FEE2E2", color: "#991B1B" },
};

export default function TodoApp() {
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [input, setInput] = useState("");
  const [tag, setTag] = useState("none");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef();
  const nextId = useRef(100);

  function addTask() {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: nextId.current++, text, done: false, tag }]);
    setInput("");
    setTag("none");
    inputRef.current.focus();
  }

  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  const visible = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Tasks</h1>
          <p style={styles.subtitle}>
            {tasks.length} tasks &middot; {doneCount} completed
          </p>
        </div>

        {/* Add Task Row */}
        <div style={styles.addRow}>
          <input
            ref={inputRef}
            style={styles.input}
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <select
            style={styles.select}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {TAG_LABELS[t]}
              </option>
            ))}
          </select>
          <button style={styles.addBtn} onClick={addTask}>
            +
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterRow}>
          {["all", "active", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? styles.filterBtnActive : {}),
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div style={styles.taskList}>
          {visible.length === 0 ? (
            <p style={styles.emptyState}>No tasks here.</p>
          ) : (
            visible.map((task) => (
              <div
                key={task.id}
                style={{
                  ...styles.taskItem,
                  opacity: task.done ? 0.5 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  style={styles.checkbox}
                />
                <span
                  style={{
                    ...styles.taskText,
                    textDecoration: task.done ? "line-through" : "none",
                    color: task.done ? "#9CA3AF" : "#111827",
                  }}
                >
                  {task.text}
                </span>
                {task.tag !== "none" && (
                  <span style={{ ...styles.tag, ...TAG_STYLES[task.tag] }}>
                    {task.tag}
                  </span>
                )}
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            {tasks.length - doneCount} remaining
          </span>
          {doneCount > 0 && (
            <button style={styles.clearBtn} onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "3rem 1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "2rem",
    width: "100%",
    maxWidth: "520px",
  },
  header: {
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "#9CA3AF",
    marginTop: "4px",
  },
  addRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "14px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "10px",
    outline: "none",
    color: "#111827",
    background: "#F9FAFB",
  },
  select: {
    padding: "10px 8px",
    fontSize: "13px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "10px",
    background: "#F9FAFB",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
  },
  addBtn: {
    width: "42px",
    height: "42px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "22px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  filterRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "1.25rem",
  },
  filterBtn: {
    padding: "6px 16px",
    fontSize: "13px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "20px",
    background: "transparent",
    color: "#6B7280",
    cursor: "pointer",
  },
  filterBtnActive: {
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    background: "#F9FAFB",
    border: "1.5px solid #F3F4F6",
    borderRadius: "10px",
    transition: "opacity 0.2s",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    flexShrink: 0,
    accentColor: "#111827",
  },
  taskText: {
    flex: 1,
    fontSize: "14px",
    lineHeight: "1.4",
  },
  tag: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 10px",
    borderRadius: "12px",
    flexShrink: 0,
    textTransform: "capitalize",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#D1D5DB",
    fontSize: "14px",
    padding: "2px 6px",
    borderRadius: "6px",
    lineHeight: 1,
  },
  emptyState: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: "14px",
    padding: "2rem 0",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1.25rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid #F3F4F6",
  },
  footerText: {
    fontSize: "13px",
    color: "#9CA3AF",
  },
  clearBtn: {
    background: "none",
    border: "none",
    fontSize: "13px",
    color: "#9CA3AF",
    cursor: "pointer",
    textDecoration: "underline",
  },
};