// src/lib/mockData.ts
import { DashboardStats } from "./types";

// Mock dashboard statistics
export const mockDashboardStats: DashboardStats = {
  totalStudents: 342,
  activeStudents: 189,
  studentsInEssayStage: 67,
  submittedApplications: 23,
  needsEssayHelp: 15,
  notContactedIn7Days: 28,
  highIntentStudents: 45,
};

// Mock recent activities
export const mockRecentActivities = [
  {
    id: "1",
    type: "ai_question" as const,
    studentName: "Sarah Johnson",
    studentId: "student_1",
    title: "Asked about Common App essay prompts",
    timestamp: new Date("2024-09-16T10:30:00"),
    details: "How do I approach the personal statement prompt?",
  },
  {
    id: "2",
    type: "essay_event" as const,
    studentName: "Michael Chen",
    studentId: "student_2",
    title: "Submitted first essay draft",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    details: "Personal statement - 650 words",
  },
  {
    id: "3",
    type: "college_view" as const,
    studentName: "Emma Davis",
    studentId: "student_3",
    title: "Viewed Stanford University",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    details: "Saved to shortlist",
  },
  {
    id: "4",
    type: "doc_upload" as const,
    studentName: "James Wilson",
    studentId: "student_4",
    title: "Uploaded transcript",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    details: "Official high school transcript",
  },
  {
    id: "5",
    type: "login" as const,
    studentName: "Ava Martinez",
    studentId: "student_5",
    title: "Logged in to platform",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
];

// Mock tasks for the dashboard
export const mockTasks = [
  {
    id: "task_1",
    studentId: "student_1",
    studentName: "Sarah Johnson",
    title: "Follow up on essay progress",
    description: "Check if she needs help with personal statement",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    status: "pending" as const,
    assignee: "John Doe",
    priority: "high" as const,
  },
  {
    id: "task_2",
    studentId: "student_6",
    studentName: "Alex Thompson",
    title: "Schedule college list review",
    description: "Review and refine college shortlist",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // Day after tomorrow
    status: "pending" as const,
    assignee: "Jane Smith",
    priority: "medium" as const,
  },
  {
    id: "task_3",
    studentId: "student_7",
    studentName: "Lily Park",
    title: "Financial aid consultation",
    description: "Discuss FAFSA and scholarship options",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 72), // 3 days
    status: "pending" as const,
    assignee: "Mike Johnson",
    priority: "high" as const,
  },
];

// Simulate API delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await delay(800); // Simulate network delay
  return mockDashboardStats;
};

export const fetchRecentActivities = async () => {
  await delay(600);
  return mockRecentActivities;
};

export const fetchUpcomingTasks = async () => {
  await delay(500);
  return mockTasks;
};
