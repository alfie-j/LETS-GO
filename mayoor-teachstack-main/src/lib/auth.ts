import { User } from "@/types";
import { showSuccess, showError } from "@/utils/toast";

const MOCK_USERS: User[] = [
  {
    id: "user1",
    email: "admin@teachstack.com",
    name: "Admin User",
    role: "admin",
    faceRegistered: true,
  },
  {
    id: "user2",
    email: "teacher@teachstack.com",
    name: "Teacher User",
    role: "teacher",
    faceRegistered: false,
  },
];

export const loginUser = async (
  email?: string,
  otp?: string,
  faceImageData?: string,
): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (faceImageData) {
        // Simulate face recognition login
        const user = MOCK_USERS.find((u) => u.faceRegistered); // Simple mock: finds any user with face registered
        if (user) {
          showSuccess(`Welcome back, ${user.name}! (Face Login)`);
          resolve(user);
        } else {
          showError("Face not recognized. Please try again or use email/OTP.");
          reject(new Error("Face not recognized"));
        }
      } else if (email && otp) {
        // Simulate email/OTP login
        const user = MOCK_USERS.find(
          (u) => u.email === email && otp === "123456",
        ); // Mock OTP
        if (user) {
          showSuccess(`Welcome back, ${user.name}!`);
          resolve(user);
        } else {
          showError("Invalid email or OTP.");
          reject(new Error("Invalid credentials"));
        }
      } else {
        showError("Please provide valid login credentials.");
        reject(new Error("No credentials provided"));
      }
    }, 1500);
  });
};

export const logoutUser = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      showSuccess("Logged out successfully.");
      resolve();
    }, 500);
  });
};

export const registerTeacherFace = async (
  teacherId: string,
  faceImageData: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(
        `Simulating face registration for teacher ${teacherId} with image data:`,
        faceImageData.substring(0, 50) + "...",
      );
      // In a real app, send imageData to backend
      showSuccess("Face registration successful!");
      resolve(true);
    }, 1500);
  });
};