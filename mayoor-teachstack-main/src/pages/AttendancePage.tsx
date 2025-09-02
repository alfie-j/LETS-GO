"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Filter, Download } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { AttendanceRecord, Teacher } from '@/types';
import { mockAttendance, mockTeachers } from '@/lib/mockData';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

// Define motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const AttendancePage = () => {
  const { isLoggedIn } = useAppContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Please log in to view attendance records.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  const filteredAttendance = mockAttendance.filter(record => {
    const matchesDate = date ? format(new Date(record.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') : true;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesMethod = methodFilter === "all" || record.method === methodFilter;
    return matchesDate && matchesStatus && matchesMethod;
  });

  // Aggregate data for chart
  const attendanceSummary = filteredAttendance.reduce((acc, record) => {
    const teacherName = getTeacherName(record.teacherId);
    if (!acc[teacherName]) {
      acc[teacherName] = { present: 0, absent: 0, late: 0 };
    }
    if (record.status === "present") acc[teacherName].present += 1;
    else if (record.status === "absent") acc[teacherName].absent += 1;
    else if (record.status === "late") acc[teacherName].late += 1;
    return acc;
  }, {} as Record<string, { present: number; absent: number; late: number }>);

  const chartData = Object.entries(attendanceSummary).map(([name, data]) => ({
    name,
    ...data,
  }));

  return (
    <motion.div
      className="container mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Attendance Management
      </motion.h1>

      <motion.div variants={itemVariants}>
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Attendance Records
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">View and manage teacher attendance records.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto"> {/* Changed for responsiveness */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[280px] justify-start text-left font-normal h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select onValueChange={setStatusFilter} value={statusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border shadow-lg">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setMethodFilter} value={methodFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Method" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border shadow-lg">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="face">Face Recognition</SelectItem>
                  <SelectItem value="otp">OTP</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border/50 shadow-inner">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-foreground">Teacher Name</TableHead>
                    <TableHead className="text-foreground">Date</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Check-in</TableHead>
                    <TableHead className="text-foreground">Check-out</TableHead>
                    <TableHead className="text-foreground">Method</TableHead>
                    <TableHead className="text-foreground">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        className="border-b border-border/30 last:border-b-0"
                      >
                        <TableCell className="font-medium text-foreground">{getTeacherName(record.teacherId)}</TableCell>
                        <TableCell className="text-muted-foreground">{record.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            record.status === "present" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700" :
                            record.status === "absent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700"
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.checkInTime || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{record.checkOutTime || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{record.method || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{record.reason || '-'}</TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No attendance records found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <BarChart className="h-6 w-6 text-primary" />
              Attendance Summary Chart
            </CardTitle>
            <CardDescription className="text-muted-foreground">Visual representation of attendance by teacher.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--foreground))" tickLine={false} axisLine={false} />
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
                  <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-present-${index}`} fill="hsl(var(--primary))" />
                      ))
                    }
                  </Bar>
                  <Bar dataKey="absent" name="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-absent-${index}`} fill="hsl(var(--destructive))" />
                      ))
                    }
                  </Bar>
                  <Bar dataKey="late" name="Late" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-late-${index}`} fill="hsl(var(--accent))" />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator className="my-8 bg-border/50" />

      <motion.div
        className="text-center text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-lg">Detailed attendance reports and analytics will be available here.</p>
      </motion.div>
    </motion.div>
  );
};

export default AttendancePage;