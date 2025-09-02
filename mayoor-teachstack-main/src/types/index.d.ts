export type UserRole = "admin" | "teacher" | "guest";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  faceRegistered: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  faceRegistered: boolean;
  lastLogin?: string;
  status: "active" | "inactive" | "on leave";
}

export type AttendanceStatus = "present" | "absent" | "late";
export type AttendanceMethod = "face" | "otp" | "manual";

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string; // HH:MM AM/PM
  checkOutTime?: string; // HH:MM AM/PM
  method?: AttendanceMethod;
  reason?: string; // For absent/late
}

export interface PerformanceMetric {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  engagementScore: number; // 0-100
  feedback: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  description: string;
  type: "attendance" | "system" | "teacher_management" | "report";
}

export interface AppConfig {
  appName: string;
  version: string;
  apiBaseUrl: string;
  features: {
    faceRecognition: boolean;
    aiInsights: boolean;
    reportGeneration: boolean;
  };
}