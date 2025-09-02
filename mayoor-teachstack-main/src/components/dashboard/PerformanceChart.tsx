import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockPerformanceMetrics } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface PerformanceChartProps {
  className?: string;
}

const PerformanceChart = ({ className }: PerformanceChartProps) => {
  // Process mock performance data for chart
  const chartData = mockPerformanceMetrics.map(metric => ({
    date: metric.date,
    engagementScore: metric.engagementScore,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <CardTitle>Teacher Engagement Trends</CardTitle>
        <CardDescription>Average engagement scores over recent days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="engagementScore"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary-foreground))", stroke: "hsl(var(--primary))" }}
                name="Engagement Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;