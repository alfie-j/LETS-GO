"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { mockPerformanceMetrics, mockTeachers } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, MessageSquare, Users, Award, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion'; // For advanced animations

const AiInsightsPage = () => {
  const { isLoggedIn } = useAppContext();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | undefined>(undefined);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Please log in to view AI Insights.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "All Teachers";
  };

  const filteredMetrics = selectedTeacherId && selectedTeacherId !== "all"
    ? mockPerformanceMetrics.filter(metric => metric.teacherId === selectedTeacherId)
    : mockPerformanceMetrics;

  // Aggregate data for charts
  const engagementChartData = filteredMetrics.reduce((acc, metric) => {
    const existing = acc.find(item => item.date === metric.date);
    if (existing) {
      existing.totalScore += metric.engagementScore;
      existing.count += 1;
      existing.averageScore = existing.totalScore / existing.count;
    } else {
      acc.push({ date: metric.date, totalScore: metric.engagementScore, count: 1, averageScore: metric.engagementScore });
    }
    return acc;
  }, [] as { date: string; totalScore: number; count: number; averageScore: number }[])
  .sort((a, b) => a.date.localeCompare(b.date))
  .map(item => ({ date: item.date, "Engagement Score": Math.round(item.averageScore) }));

  // Data for performance radar chart (mock data for demonstration)
  const performanceRadarData = [
    { subject: 'Preparation', A: 120, B: 110, fullMark: 150 },
    { subject: 'Delivery', A: 98, B: 130, fullMark: 150 },
    { subject: 'Interaction', A: 86, B: 130, fullMark: 150 },
    { subject: 'Content', A: 99, B: 100, fullMark: 150 },
    { subject: 'Feedback', A: 85, B: 90, fullMark: 150 },
    { subject: 'Innovation', A: 65, B: 85, fullMark: 150 },
  ];

  const latestFeedback = filteredMetrics.length > 0
    ? filteredMetrics[filteredMetrics.length - 1].feedback
    : "No recent feedback.";

  const averageEngagementOverall = filteredMetrics.length > 0
    ? (filteredMetrics.reduce((sum, metric) => sum + metric.engagementScore, 0) / filteredMetrics.length).toFixed(1)
    : "N/A";

  // Calculate engagement trend (simplified)
  const engagementTrend = filteredMetrics.length >= 2
    ? (filteredMetrics[filteredMetrics.length - 1].engagementScore - filteredMetrics[filteredMetrics.length - 2].engagementScore).toFixed(1)
    : "0.0";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { y: -8, scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.15)", transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        AI Insights Dashboard
      </motion.h1>

      <motion.div variants={itemVariants} className="flex justify-center mb-8">
        <Select onValueChange={setSelectedTeacherId} value={selectedTeacherId}>
          <SelectTrigger className="w-full md:w-[300px] h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select Teacher" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-lg">
            <SelectItem value="all">All Teachers</SelectItem>
            {mockTeachers.map(teacher => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Avg. Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{averageEngagementOverall}%</div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Overall average</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Engagement Trend</CardTitle>
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {engagementTrend >= 0 ? '+' : ''}{engagementTrend}%
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">Change from last record</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">Latest Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-900 dark:text-amber-100 truncate">{latestFeedback}</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">AI-generated comment</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">AI Status</CardTitle>
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-700 dark:hover:bg-green-800">Active</Badge>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">All models running</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <TrendingUp className="h-6 w-6 text-primary" />
                Engagement Score Trend
              </CardTitle>
              <CardDescription className="text-muted-foreground">Daily engagement scores for {getTeacherName(selectedTeacherId || "all")}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={engagementChartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--foreground))" tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--foreground))" domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ color: "hsl(var(--primary))", fontWeight: "bold", marginBottom: "5px" }}
                      formatter={(value) => [`${value}%`, 'Engagement Score']}
                    />
                    <Area
                      type="monotone"
                      dataKey="Engagement Score"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorEngagement)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
                      animationDuration={1200}
                    />
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <Award className="h-6 w-6 text-primary" />
                Performance Radar
              </CardTitle>
              <CardDescription className="text-muted-foreground">Multi-dimensional performance analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceRadarData}>
                    <PolarGrid stroke="hsl(var(--muted))" />
                    <PolarAngleAxis dataKey="subject" stroke="hsl(var(--foreground))" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="hsl(var(--foreground))" />
                    <Radar
                      name="Current"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      dot={{ r: 4, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                      animationDuration={1200}
                    />
                    <Radar
                      name="Target"
                      dataKey="B"
                      stroke="hsl(var(--secondary))"
                      fill="hsl(var(--secondary))"
                      fillOpacity={0.2}
                      dot={{ r: 4, fill: "hsl(var(--secondary))" }}
                      activeDot={{ r: 6, stroke: "hsl(var(--secondary))", strokeWidth: 2 }}
                      animationDuration={1200}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ color: "hsl(var(--primary))", fontWeight: "bold", marginBottom: "5px" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Separator className="my-8 bg-border/50" />

      <motion.div
        className="text-center text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-lg">Detailed AI reports and predictive analytics will be available here.</p>
      </motion.div>
    </motion.div>
  );
};

export default AiInsightsPage;