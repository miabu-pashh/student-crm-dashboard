"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthWrapper from "@/components/dashboard/AuthWrapper";
// import { generateMockStudents } from "@/lib/seedData";
import { getStudentById } from "@/lib/seedData";
import TypingText from "@/components/dashboard/TypingText";

import {
  logCommunication,
  updateCommunication,
  deleteCommunication,
} from "@/lib/comms";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; // you already have this in firebase.ts
import {
  watchStudent,
  updateStudentStatus,
  ApplicationStatus,
} from "@/lib/students";
import {
  watchTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
  Task,
} from "@/lib/tasks";
import { generateMockSummary } from "@/lib/ai";

function formatDate(ts: any): string {
  if (!ts) return "";
  if (typeof ts.toDate === "function") {
    return ts.toDate().toLocaleString();
  }
  if (ts.seconds) {
    // Firestore Timestamp-like object
    return new Date(ts.seconds * 1000).toLocaleString();
  }
  return "";
}
interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  schoolYear: string;
  gpa?: number;
  satScore?: number;
  applicationStatus: "Exploring" | "Shortlisting" | "Applying" | "Submitted";
  lastActive: Date;
  intentScore: number;
  needsEssayHelp: boolean;
  preferredMajors: string[];
  tuitionBudget: string;
}

export default function StudentProfilePage() {
  const params = useParams();

  const { user } = useAuth();
  async function handleLog(type: "email" | "call" | "note", message: string) {
    if (!user) {
      alert("Not signed in");
      return;
    }
    try {
      await logCommunication(
        params.id as string,
        type,
        message,
        user.email ?? "unknown"
      );
      alert(`${type} logged ✅`);
    } catch (err) {
      console.error(err);
      alert("Failed to log communication ❌ (see console)");
    }
  }

  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [mounted, setMounted] = useState(false);
  const [comms, setComms] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [pendingStage, setPendingStage] = useState<ApplicationStatus | null>(
    null
  );
  // For editing notes
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");

  useEffect(() => {
    const unsub = watchTasks(params.id as string, (t) => setTasks(t));
    return () => unsub();
  }, [params.id]);

  useEffect(() => {
    const q = query(
      collection(db, "students", params.id as string, "comms"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setComms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [params.id]);

  useEffect(() => {
    const unsub = watchStudent<Student>(params.id as string, (doc) => {
      setStudent(doc);
      setMounted(true);
    });
    return () => unsub();
  }, [params.id]);

  if (!mounted) {
    return (
      <AuthWrapper>
        <div style={{ padding: "24px", textAlign: "center" }}>
          Loading student profile...
        </div>
      </AuthWrapper>
    );
  }

  if (!student) {
    return (
      <AuthWrapper>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <h2>Student Not Found</h2>
          <button
            onClick={() => router.push("/students")}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Back to Students
          </button>
        </div>
      </AuthWrapper>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Exploring":
        return "#3b82f6";
      case "Shortlisting":
        return "#f59e0b";
      case "Applying":
        return "#ef4444";
      case "Submitted":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "24px",
  };

  // Add this component in the student profile
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "Exploring":
        return 25;
      case "Shortlisting":
        return 50;
      case "Applying":
        return 75;
      case "Submitted":
        return 100;
      default:
        return 0;
    }
  };

  function currentStage(): ApplicationStatus {
    if (!student) return "Exploring"; // default
    return (pendingStage ?? student.applicationStatus) as ApplicationStatus;
  }

  return (
    <AuthWrapper>
      <div style={{ padding: "24px", maxWidth: "80rem", margin: "0 auto" }}>
        {/* AI Summary */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            AI Summary
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#374151",
              textAlign: "center",
            }}
          >
            {/* {generateMockSummary(student)} */}
            <TypingText text={generateMockSummary(student)} speed={35} />
          </p>
        </div>
        {/* Header */}
        <div style={cardStyle}>
          <button
            onClick={() => router.back()}
            style={{
              marginBottom: "16px",
              padding: "8px 16px",
              backgroundColor: "#f3f4f6",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ← Back to Students
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  margin: "0 0 8px 0",
                }}
              >
                {student.name}
              </h1>
              <p style={{ color: "#6b7280", margin: "0 0 16px 0" }}>
                {student.email} • {student.country}
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  backgroundColor:
                    getStatusColor(student.applicationStatus) + "20",
                  color: getStatusColor(student.applicationStatus),
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {student.applicationStatus}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color:
                    student.intentScore >= 80
                      ? "#10b981"
                      : student.intentScore >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {student.intentScore}%
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Intent Score
              </div>
            </div>
          </div>
        </div>

        {/* // Add this after the header div: */}
        <div style={{ ...cardStyle, padding: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Application Progress
            </span>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {getProgressPercentage(currentStage())}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f3f4f6",
              borderRadius: "6px",
              height: "8px",
            }}
          >
            <div
              style={{
                width: `${getProgressPercentage(currentStage())}%`,
                backgroundColor: getStatusColor(currentStage()),
                height: "100%",
                borderRadius: "6px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: "0.875rem" }}>Stage:</label>
          <select
            value={currentStage()}
            onChange={(e) =>
              setPendingStage(e.target.value as ApplicationStatus)
            }
            style={{
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          >
            <option value="Exploring">Exploring</option>
            <option value="Shortlisting">Shortlisting</option>
            <option value="Applying">Applying</option>
            <option value="Submitted">Submitted</option>
          </select>
          <button
            onClick={async () => {
              if (!student) return;
              const stage = currentStage();
              await updateStudentStatus(student.id, stage);
              setPendingStage(null);
              alert(`Stage updated to ${stage} ✅`);
            }}
            style={{
              padding: "6px 12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Save
          </button>
        </div>
        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
          }}
        >
          {/* Left Column */}
          <div>
            {/* Student Information */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Student Information
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <strong>Phone:</strong> {student.phone || "Not provided"}
                </div>
                <div>
                  <strong>School Year:</strong> {student.schoolYear}
                </div>
                <div>
                  <strong>GPA:</strong> {student.gpa || "Not provided"}
                </div>
                <div>
                  <strong>SAT Score:</strong>{" "}
                  {student.satScore || "Not provided"}
                </div>
                <div>
                  <strong>Preferred Majors:</strong>{" "}
                  {student.preferredMajors?.join(", ") || "Not specified"}
                </div>
                <div>
                  <strong>Budget:</strong> {student.tuitionBudget}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Recent Activity
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ fontWeight: "500" }}>
                    Asked about essay requirements
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    2 hours ago
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ fontWeight: "500" }}>
                    Viewed college recommendations
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Yesterday
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ fontWeight: "500" }}>
                    Updated profile information
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    3 days ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Quick Actions */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {/* <button
                  style={{
                    padding: "12px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  📧 Send Email
                </button>
                <button
                  style={{
                    padding: "12px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  📞 Schedule Call
                </button>
                <button
                  style={{
                    padding: "12px",
                    backgroundColor: "#7c3aed",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  📝 Add Note
                </button> */}
                <button
                  style={{
                    padding: "12px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onClick={() => handleLog("email", "Follow-up about essays")}
                >
                  📧 Send Email
                </button>

                <button
                  style={{
                    padding: "12px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onClick={() =>
                    handleLog("call", "Scheduled call with student")
                  }
                >
                  📞 Schedule Call
                </button>
              </div>
            </div>

            {/* Status Alerts */}
            {student.needsEssayHelp && (
              <div
                style={{
                  ...cardStyle,
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <h3
                  style={{
                    color: "#dc2626",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  ⚠️ Needs Essay Help
                </h3>
                <p
                  style={{ fontSize: "0.875rem", color: "#7f1d1d", margin: 0 }}
                >
                  This student has been flagged as needing assistance with essay
                  writing.
                </p>
              </div>
            )}
            <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Internal Notes
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                {comms
                  .filter((c) => c.type === "note")
                  .map((note) => (
                    <div
                      key={note.id}
                      style={{
                        padding: "8px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "6px",
                      }}
                    >
                      {editingNoteId === note.id ? (
                        <>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "0.875rem",
                            }}
                          />
                          <div
                            style={{
                              marginTop: "6px",
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            <button
                              onClick={async () => {
                                await updateCommunication(
                                  student.id,
                                  note.id,
                                  editText.trim(),
                                  user?.email ?? "unknown"
                                );
                                setEditingNoteId(null);
                                setEditText("");
                              }}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.875rem",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingNoteId(null);
                                setEditText("");
                              }}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#9ca3af",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.875rem",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {note.message}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              margin: 0,
                            }}
                          >
                            {note.createdBy} •{" "}
                            {note.createdAt?.toDate
                              ? note.createdAt.toDate().toLocaleDateString()
                              : ""}
                          </p>
                          <div
                            style={{
                              marginTop: "6px",
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            <button
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditText(note.message);
                              }}
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#f59e0b",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={async () => {
                                await deleteCommunication(
                                  student.id,
                                  note.id,
                                  user?.email ?? "unknown"
                                );
                              }}
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
              <div style={cardStyle}>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  Tasks / Reminders
                </h2>

                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task description..."
                    style={{
                      width: "100%",
                      marginBottom: "8px",
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                  <input
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    style={{
                      width: "100%",
                      marginBottom: "8px",
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                  <button
                    onClick={async () => {
                      if (!taskTitle || !taskDue) return;
                      await addTask(
                        student.id,
                        taskTitle,
                        new Date(taskDue),
                        user?.email ?? "unknown"
                      );
                      setTaskTitle("");
                      setTaskDue("");
                    }}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    ➕ Add Task
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {tasks.length === 0 ? (
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      No tasks yet.
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          padding: "8px",
                          backgroundColor: "#f9fafb",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <input
                              type="checkbox"
                              checked={task.status === "done"}
                              onChange={() =>
                                updateTaskStatus(
                                  student.id,
                                  task.id,
                                  task.status === "done" ? "open" : "done"
                                )
                              }
                            />
                            <span
                              style={{
                                marginLeft: "8px",
                                textDecoration:
                                  task.status === "done"
                                    ? "line-through"
                                    : "none",
                              }}
                            >
                              {task.title}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteTask(student.id, task.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#6b7280",
                            margin: "4px 0 0",
                          }}
                        >
                          Due:{" "}
                          {task.dueDate?.toDate
                            ? task.dueDate.toDate().toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add new note */}
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note about this student..."
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  marginBottom: "8px",
                }}
              />
              <button
                onClick={() => {
                  if (noteInput.trim()) {
                    handleLog("note", noteInput.trim());
                    setNoteInput("");
                  }
                }}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              >
                Add Note
              </button>
            </div>

            {/* Communication Log */}
            {/* <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Communication Log
              </h2>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                <p>📧 Last email: 5 days ago</p>
                <p>📞 Last call: 2 weeks ago</p>
                <p>💬 Last chat: Yesterday</p>
              </div>
              <button
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                View Full History
              </button>
            </div> */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Communication Log
              </h2>
              <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                {comms.length === 0 ? (
                  <p>No communications logged yet.</p>
                ) : (
                  comms.map((comm) => (
                    <div
                      key={comm.id}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        {comm.type === "email" && "📧"}
                        {comm.type === "call" && "📞"}
                        {comm.type === "note" && "📝"}
                        {comm.type === "system" && "⚙️"} {comm.message}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {comm.createdBy} • {formatDate(comm.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
