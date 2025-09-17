// src/lib/comms.ts
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function logCommunication(
  studentId: string,
  type: "email" | "call" | "note" | "system",
  message: string,
  createdBy: string
) {
  const colRef = collection(db, `students/${studentId}/comms`);
  await addDoc(colRef, {
    type,
    message,
    createdBy,
    createdAt: serverTimestamp(),
  });
}

export async function updateCommunication(
  studentId: string,
  commId: string,
  message: string,
  editor: string
) {
  const docRef = doc(db, `students/${studentId}/comms/${commId}`);

  // update the note itself
  await updateDoc(docRef, {
    message,
    updatedAt: serverTimestamp(),
    updatedBy: editor,
  });

  // add an audit log entry
  await logCommunication(
    studentId,
    "system",
    `Note ${commId} was edited`,
    editor
  );
}

export async function deleteCommunication(
  studentId: string,
  commId: string,
  deleter: string
) {
  const docRef = doc(db, `students/${studentId}/comms/${commId}`);

  // delete the note itself
  await deleteDoc(docRef);

  // add an audit log entry
  await logCommunication(
    studentId,
    "system",
    `Note ${commId} was deleted`,
    deleter
  );
}
