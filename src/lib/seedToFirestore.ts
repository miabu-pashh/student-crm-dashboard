// src/lib/seedToFirestore.ts
import { db } from "./firebase";
import { generateMockStudents } from "./seedData";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function seedStudentsToFirestore(count: number = 25) {
  const students = generateMockStudents(count);
  const studentsCol = collection(db, "students");

  for (const student of students) {
    const docRef = doc(studentsCol, student.id);
    await setDoc(docRef, {
      ...student,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  console.log(`${count} students seeded to Firestore ✅`);
}
