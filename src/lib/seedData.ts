// src/lib/seedData.ts
import { Student } from "./types";

let cachedStudents: Student[] | null = null;

export const generateMockStudents = (count: number = 25): Student[] => {
  // Return cached students if they exist to ensure consistency
  if (cachedStudents && cachedStudents.length >= count) {
    return cachedStudents.slice(0, count);
  }

  const firstNames = [
    "Sarah",
    "Michael",
    "Emma",
    "James",
    "Ava",
    "William",
    "Olivia",
    "Benjamin",
    "Sophia",
    "Lucas",
    "Isabella",
    "Henry",
    "Mia",
    "Alexander",
    "Charlotte",
    "Daniel",
    "Amelia",
    "Matthew",
    "Harper",
    "Jackson",
  ];
  const lastNames = [
    "Johnson",
    "Chen",
    "Davis",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Robinson",
    "Clark",
    "Rodriguez",
    "Lewis",
    "Lee",
    "Walker",
  ];
  const countries = [
    "USA",
    "Canada",
    "UK",
    "Australia",
    "India",
    "Germany",
    "France",
    "Spain",
    "Netherlands",
    "Singapore",
  ];
  const statuses: Student["applicationStatus"][] = [
    "Exploring",
    "Shortlisting",
    "Applying",
    "Submitted",
  ];
  const majors = [
    "Computer Science",
    "Business",
    "Engineering",
    "Biology",
    "Psychology",
    "Economics",
  ];
  const classSizes: Student["preferredClassSize"][] = [
    "Small",
    "Medium",
    "Large",
    "No preference",
  ];

  const students: Student[] = [];

  // Use seed for consistent generation
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(random() * firstNames.length)];
    const lastName = lastNames[Math.floor(random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
    const country = countries[Math.floor(random() * countries.length)];
    const status = statuses[Math.floor(random() * statuses.length)];
    const intentScore = Math.floor(random() * 40) + 60; // 60-100
    const needsEssayHelp = random() < 0.3; // 30% need help
    const lastActive = new Date(
      Date.now() - random() * 1000 * 60 * 60 * 24 * 14
    );

    const selectedMajors = [majors[Math.floor(random() * majors.length)]];
    const selectedClassSize =
      classSizes[Math.floor(random() * classSizes.length)];

    students.push({
      id: `student_${i + 1}`,
      name: `${firstName} ${lastName}`,
      email,
      phone: `+1-555-${String(Math.floor(random() * 9000) + 1000)}`,
      country,
      schoolYear: "Senior",
      gpa: Number((random() * 1.5 + 2.5).toFixed(2)),
      satScore: Math.floor(random() * 600) + 1000,
      preferredMajors: selectedMajors,
      preferredStates: ["California", "New York", "Texas"],
      preferredClassSize: selectedClassSize,
      tuitionBudget: "$50,000-$70,000",
      applicationStatus: status,
      lastActive,
      intentScore,
      needsEssayHelp,
      createdAt: new Date(Date.now() - random() * 1000 * 60 * 60 * 24 * 90),
      updatedAt: lastActive,
    });
  }

  // Cache the students for consistency
  cachedStudents = students;
  return students;
};

// Function to get a specific student by ID
export const getStudentById = (id: string): Student | null => {
  const students = generateMockStudents(50);
  return students.find((student) => student.id === id) || null;
};
