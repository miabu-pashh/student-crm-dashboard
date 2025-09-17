// src/lib/students.ts
import { db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  collection,
  writeBatch,
} from "firebase/firestore";

export type ApplicationStatus =
  | "Exploring"
  | "Shortlisting"
  | "Applying"
  | "Submitted";

export const studentRef = (id: string) => doc(db, "students", id);

/** Live subscribe to a student document */
export function watchStudent<T = any>(
  id: string,
  cb: (data: (T & { id: string }) | null) => void
) {
  return onSnapshot(studentRef(id), (snap) => {
    if (!snap.exists()) return cb(null);
    cb({ id: snap.id, ...(snap.data() as T) });
  });
}

/** Update application stage + add a timeline note */
export async function updateStudentStatus(
  id: string,
  status: ApplicationStatus
) {
  const batch = writeBatch(db);

  // update student doc
  batch.update(studentRef(id), {
    applicationStatus: status,
    updatedAt: serverTimestamp(),
  });

  // add timeline entry
  const timelineCol = collection(db, `students/${id}/timeline`);
  const newTimelineRef = doc(timelineCol);
  batch.set(newTimelineRef, {
    type: "milestone",
    title: `Stage set to ${status}`,
    at: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  await batch.commit();
}
