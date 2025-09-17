// src/lib/tasks.ts
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  dueDate: any;
  status: "open" | "done";
  createdBy: string;
  createdAt: any;
  studentId?: string; // added for collectionGroup queries
}

/** Watch tasks for a specific student */
export function watchTasks(studentId: string, cb: (tasks: Task[]) => void) {
  const q = query(
    collection(db, `students/${studentId}/tasks`),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((doc) => ({
        ...(doc.data() as Omit<Task, "id">),
        id: doc.id,
      }))
    );
  });
}

/** Add a new task to a student */
export async function addTask(
  studentId: string,
  title: string,
  dueDate: Date,
  createdBy: string
) {
  const colRef = collection(db, `students/${studentId}/tasks`);
  await addDoc(colRef, {
    title,
    dueDate,
    status: "open",
    createdBy,
    createdAt: serverTimestamp(),
    studentId, // so we can know where it belongs in reminders
  });
}

/** Update a student’s task status */
export async function updateTaskStatus(
  studentId: string,
  taskId: string,
  status: "open" | "done"
) {
  const docRef = doc(db, `students/${studentId}/tasks/${taskId}`);
  await updateDoc(docRef, { status });
}

/** Delete a student’s task */
export async function deleteTask(studentId: string, taskId: string) {
  const docRef = doc(db, `students/${studentId}/tasks/${taskId}`);
  await deleteDoc(docRef);
}

/** 🔔 Watch all OPEN tasks across all students for the current user */
export function watchMyOpenTasks(
  userEmail: string,
  cb: (tasks: Task[]) => void
) {
  const q = query(
    collectionGroup(db, "tasks"),
    where("createdBy", "==", userEmail),
    where("status", "==", "open"),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((doc) => ({
        ...(doc.data() as Omit<Task, "id">),
        id: doc.id,
      }))
    );
  });
}
