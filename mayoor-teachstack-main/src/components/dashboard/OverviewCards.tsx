import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

const OverviewCard = ({ title, value, description, icon: Icon, className }: OverviewCardProps) => (
  <Card className={cn("animate-scale-up transition-all duration-300 hover:shadow-lg hover:border-primary", className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const OverviewCards = () => {
  // Mock data for overview cards
  const totalTeachers = 50;
  const presentTeachers = 45;
  const absentTeachers = totalTeachers - presentTeachers;
  const avgEngagement = 88.5;
  const criticalAlerts = 2;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Teachers"
        value={totalTeachers.toString()}
        description="Registered in the system"
        icon={Users}
      />
      <OverviewCard
        title="Teachers Present Today"
        value={presentTeachers.toString()}
        description={`${((presentTeachers / totalTeachers) * 100).toFixed(0)}% attendance`}
        icon={CalendarCheck}
        className="border-l-4 border-green-500"
      />
      <OverviewCard
        title="Average Engagement Score"
        value={`${avgEngagement}%`}
        description="Based on AI insights"
        icon={TrendingUp}
        className="border-l-4 border-blue-500"
      />
      <OverviewCard
        title="Critical Alerts"
        value={criticalAlerts.toString()}
        description="Immediate attention required"
        icon={AlertTriangle}
        className="border-l-4 border-red-500"
      />
    </div>
  );
};

export default OverviewCards;