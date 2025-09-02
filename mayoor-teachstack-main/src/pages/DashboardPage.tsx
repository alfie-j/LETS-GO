import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { mockAttendance, mockPerformanceMetrics } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, description, icon: Icon, color }: StatCardProps) => (
  <Card className={`border-l-4 ${color} bg-card`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Please log in to view the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data calculations
  const totalTeachers = 50;
  const presentTeachers = mockAttendance.filter(a => a.status === "present").length;
  const avgEngagement = mockPerformanceMetrics.reduce((sum, m) => sum + m.engagementScore, 0) / mockPerformanceMetrics.length;
  const criticalAlerts = 2;

  // Process attendance data for chart
  const attendanceData = mockAttendance.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = { date, present: 0, absent: 0 };
    }
    if (record.status === "present") acc[date].present += 1;
    else if (record.status === "absent") acc[date].absent += 1;
    return acc;
  }, {} as Record<string, { date: string; present: number; absent: number }>);

  const chartData = Object.values(attendanceData).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Teachers"
          value={totalTeachers.toString()}
          description="Registered in system"
          icon={Users}
          color="border-blue-500"
        />
        <StatCard
          title="Present Today"
          value={presentTeachers.toString()}
          description={`${Math.round((presentTeachers / totalTeachers) * 100)}% attendance`}
          icon={CalendarCheck}
          color="border-green-500"
        />
        <StatCard
          title="Avg Engagement"
          value={`${avgEngagement.toFixed(1)}%`}
          description="Based on AI insights"
          icon={TrendingUp}
          color="border-purple-500"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalAlerts.toString()}
          description="Require attention"
          icon={AlertTriangle}
          color="border-red-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
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
                />
                <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;