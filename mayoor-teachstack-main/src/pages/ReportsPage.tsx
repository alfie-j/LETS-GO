import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { showSuccess } from '@/utils/toast';
import { Download, BarChart3, FileText, Settings2 } from 'lucide-react'; // Added icons
import { motion } from 'framer-motion';

const ReportsPage = () => {
  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Please log in to view reports.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleGenerateReport = () => {
    showSuccess("Simulating report generation... (CSV export coming soon!)");
    console.log("Generating report...");
    // In a real app, this would trigger a backend call to generate and download a report.
  };

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.15)", transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto p-6 space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Reports & Analytics
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
                <FileText className="h-7 w-7 text-blue-600" /> Generate Attendance Report
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Generate a detailed attendance report for all teachers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-foreground/80">
                Select parameters (e.g., date range, specific teachers) to customize your report.
                For MVP, this will generate a simple CSV.
              </p>
              <Button
                onClick={handleGenerateReport}
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
              >
                <Download className="mr-3 h-5 w-5" /> Generate Report (CSV)
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-l-4 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
                <BarChart3 className="h-7 w-7 text-green-600" /> Performance Analytics Report
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                View insights into teacher engagement and performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-foreground/80">
                This section will feature advanced analytics and predictive insights based on AI models.
              </p>
              <Button
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                disabled
              >
                <Settings2 className="mr-3 h-5 w-5" /> View Performance Report (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="text-center text-muted-foreground mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-lg">Explore comprehensive data to drive educational excellence.</p>
      </motion.div>
    </motion.div>
  );
};

export default ReportsPage;