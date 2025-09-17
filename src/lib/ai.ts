// src/lib/ai.ts
import { Student } from "@/lib/types";

export function generateMockSummary(student: Partial<Student>): string {
  return `${student.name} is a ${student.schoolYear ?? "student"} from ${
    student.country
  }. 
  Currently in the ${student.applicationStatus} stage with an intent score of ${
    student.intentScore
  }%. 
  ${
    student.needsEssayHelp
      ? "They need essay support."
      : "They are progressing steadily."
  }`;
}
