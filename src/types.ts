import { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  childName?: string;
  photoURL: string;
  role: "user" | "specialist";
  createdAt: any;
}

export interface CompletedDay {
  completed: boolean;
  note: string;
  completedAt?: any;
  // Progress tracking fields
  languageUnderstanding?: boolean;
  fineMotor?: boolean;
  grossMotor?: boolean;
  attention?: boolean;
  reactionToQuestions?: boolean;
  instructorGesture?: boolean;
  socialSkills?: boolean;
}

export type CompletedDays = Record<number, CompletedDay>;
