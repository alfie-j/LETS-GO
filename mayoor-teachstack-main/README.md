# TeachStack Dashboard

This is a modern dashboard application for managing teachers, attendance, and performance insights, built with React, TypeScript, Tailwind CSS, and Shadcn UI.

## Features

-   **Authentication:** Email/OTP and Face Recognition login (simulated).
-   **Dashboard:** Overview of teacher status, performance, and recent activity.
-   **Teacher Management:** Add new teachers, register face profiles.
-   **Attendance Tracking:** View attendance statistics and detailed tables.
-   **AI Insights:** Simulated AI-driven performance insights.
-   **Settings:** Security and general application settings.
-   **Responsive Layout:** Optimized for various screen sizes.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd teachstack-dashboard
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

## Project Structure

```
src/
├── assets/
├── components/
│   ├── ai/
│   ├── attendance/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── settings/
│   └── teachers/
├── context/
├── hooks/
├── lib/
│   ├── auth.ts
│   ├── mockData.ts
│   └── utils/
├── pages/
├── types/
└── App.tsx
└── main.tsx
```

## Technologies Used

-   **React**
-   **TypeScript**
-   **Vite**
-   **Tailwind CSS**
-   **Shadcn UI**
-   **React Router DOM**
-   **Zod**
-   **React Hook Form**
-   **Sonner** (for toasts)
-   **Lucide React** (for icons)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.