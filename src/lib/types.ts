// src/lib/types.ts

export type ApplicationStatus =
  | "Exploring"
  | "Shortlisting"
  | "Applying"
  | "Submitted";

export type TimelineEventType =
  | "login"
  | "ai_question"
  | "doc_upload"
  | "college_view"
  | "essay_event"
  | "profile_update";

export type CommunicationType = "email" | "sms" | "call";
export type CommunicationDirection = "inbound" | "outbound";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  schoolYear: string;
  gpa?: number;
  satScore?: number;
  actScore?: number;

  // Preferences
  preferredMajors: string[];
  preferredStates: string[];
  preferredClassSize: "Small" | "Medium" | "Large" | "No preference";
  tuitionBudget: string;

  // Status tracking
  applicationStatus: ApplicationStatus;
  lastActive: Date;
  intentScore: number; // 0-100
  needsEssayHelp: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  studentId: string;
  type: TimelineEventType;
  title: string;
  details?: string;
  at: Date;
}

export interface Communication {
  id: string;
  studentId: string;
  via: CommunicationType;
  direction: CommunicationDirection;
  subject?: string;
  body: string;
  author: string; // staff member name
  at: Date;
}

export interface Note {
  id: string;
  studentId: string;
  text: string;
  author: string;
  at: Date;
}

export interface Essay {
  id: string;
  studentId: string;
  topic: string;
  content: string;
  aiPercent: number;
  status: "draft" | "review" | "final";
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  studentId: string;
  type: string;
  organization: string;
  role: string;
  description: string;
  timing: string;
  labels: string[];
  hours?: number;
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  dueAt: Date;
  status: "pending" | "completed" | "overdue";
  assignee: string;
  createdAt: Date;
}

// Dashboard stats interface
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  studentsInEssayStage: number;
  submittedApplications: number;
  needsEssayHelp: number;
  notContactedIn7Days: number;
  highIntentStudents: number;
}

// Filter interfaces
export interface StudentFilters {
  search?: string;
  country?: string;
  applicationStatus?: ApplicationStatus;
  needsEssayHelp?: boolean;
  notContactedDays?: number;
  highIntent?: boolean;
}
//added for versiong2

export type CommVia = "email" | "sms" | "call";
export type CommDirection = "outbound" | "inbound";

export interface CommLog {
  id?: string;
  via: CommVia;
  direction: CommDirection;
  subject?: string;
  body?: string;
  at: Date;
  authorUid: string;
  authorName?: string;
}
