"use client";

import { useEffect, useState } from "react";
import { watchMyOpenTasks, updateTaskStatus, Task } from "@/lib/tasks";
import { useAuth } from "@/hooks/useAuth";

export default function ReminderBell() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    const unsub = watchMyOpenTasks(user.email, setTasks);
    return () => unsub();
  }, [user?.email]);

  if (!user) return null;

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          position: "relative",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        🔔
        {tasks.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {tasks.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "280px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 50,
          }}
        >
          <div
            style={{
              padding: "12px",
              fontWeight: 600,
              borderBottom: "1px solid #eee",
            }}
          >
            Reminders
          </div>
          {tasks.length === 0 ? (
            <div style={{ padding: "12px", color: "#6b7280" }}>
              No pending tasks 🎉
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Due:{" "}
                    {task.dueDate?.toDate
                      ? task.dueDate.toDate().toLocaleDateString()
                      : ""}
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateTaskStatus(task.studentId!, task.id, "done")
                  }
                  style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
