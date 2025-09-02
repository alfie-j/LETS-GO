import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockAttendance } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface AttendanceChartProps {
  className?: string;
}

const AttendanceChart = ({ className }: AttendanceChartProps) => {
  // Process mock attendance data for chart
  const attendanceData = mockAttendance.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = { date, present: 0, absent: 0 };
    }
    if (record.status === "present") {
      acc[date].present += 1;
    } else if (record.status === "absent") {
      acc[date].absent += 1;
    }
    return acc;
  }, {} as Record<string, { date: string; present: number; absent: number }>);

  const chartData = Object.values(attendanceData).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <CardTitle>Daily Attendance Overview</CardTitle>
        <CardDescription>Number of teachers present and absent over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" />
              <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;