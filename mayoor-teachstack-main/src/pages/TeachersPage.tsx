"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { showSuccess, showError } from '@/utils/toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Camera, UserPlus, Edit, Trash2, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { Teacher } from '@/types';
import { mockTeachers } from '@/lib/mockData';
import { registerTeacherFace } from '@/lib/auth';
import { motion } from 'framer-motion'; // For advanced animations
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components
import FaceScanCamera from '@/components/FaceScanCamera'; // Import the new component

const TeachersPage = () => {
  const { isLoggedIn, appConfig } = useAppContext();
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'on leave'>('all');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // This canvas remains hidden for image capture
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentTeacherForFaceReg, setCurrentTeacherForFaceReg] = useState<Teacher | null>(null);
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [isRegisterFaceDialogOpen, setIsRegisterFaceDialogOpen] = useState(false);
  const [isRegisteringFace, setIsRegisteringFace] = useState(false);

  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          showError("Failed to access camera. Please ensure it's enabled.");
          setIsCameraActive(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    // Cleanup camera on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Please log in to manage teacher profiles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacherName && newTeacherEmail) {
      const newTeacher: Teacher = {
        id: `T${String(teachers.length + 1).padStart(3, '0')}`,
        name: newTeacherName,
        email: newTeacherEmail,
        faceRegistered: false,
        status: "active",
      };
      setTeachers([...teachers, newTeacher]);
      setNewTeacherName('');
      setNewTeacherEmail('');
      showSuccess(`Teacher ${newTeacher.name} added!`);
      setIsAddTeacherDialogOpen(false);
    } else {
      showError("Please fill in both name and email.");
    }
  };

  const handleRegisterFaceClick = (teacher: Teacher) => {
    if (!appConfig.features.faceRecognition) {
      showError("Face recognition is not enabled in this application.");
      return;
    }
    setCurrentTeacherForFaceReg(teacher);
    setIsCameraActive(true);
    setIsRegisterFaceDialogOpen(true);
  };

  const captureFaceForRegistration = async () => {
    if (videoRef.current && canvasRef.current && currentTeacherForFaceReg) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        // Draw the current video frame to the hidden canvas for capture
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/jpeg');

        setIsRegisteringFace(true);
        try {
          const success = await registerTeacherFace(currentTeacherForFaceReg.id, imageData);
          if (success) {
            setTeachers(teachers.map(t =>
              t.id === currentTeacherForFaceReg.id ? { ...t, faceRegistered: true } : t
            ));
            showSuccess("Face registered successfully!");
          } else {
            showError("Face registration failed. Please try again.");
          }
        } catch (error) {
          showError("An error occurred during face registration.");
          console.error("Face registration error:", error);
        } finally {
          setIsRegisteringFace(false);
          setIsCameraActive(false);
          setIsRegisterFaceDialogOpen(false);
          setCurrentTeacherForFaceReg(null);
        }
      }
    } else {
      showError("Camera not active or no teacher selected for registration.");
    }
  };

  // Filter teachers based on search term and status
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <motion.div
      className="container mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Teacher Management
      </motion.h1>

      <motion.div variants={itemVariants}>
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <UserPlus className="h-6 w-6 text-primary" />
                All Teachers
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">Manage existing teacher profiles and their face registrations.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto"> {/* Changed for responsiveness */}
              <div className="relative flex-grow"> {/* flex-grow to take available space */}
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
              </div>
              <Select onValueChange={(value: 'all' | 'active' | 'inactive' | 'on leave') => setStatusFilter(value)} value={statusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border shadow-lg">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                    <UserPlus className="mr-2 h-4 w-4" /> Add New Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-md border-border shadow-2xl" variants={dialogVariants} initial="hidden" animate="visible" exit="exit">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">Add New Teacher</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Enter the details for the new teacher.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTeacher} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="newTeacherName" className="text-right text-foreground">
                        Name
                      </Label>
                      <Input
                        id="newTeacherName"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        className="col-span-3 h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="newTeacherEmail" className="text-right text-foreground">
                        Email
                      </Label>
                      <Input
                        id="newTeacherEmail"
                        type="email"
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        className="col-span-3 h-10 bg-input/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">Add Teacher</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border/50 shadow-inner">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-foreground">Avatar</TableHead>
                    <TableHead className="text-foreground">ID</TableHead>
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Email</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Face Registered</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher, index) => (
                      <motion.tr
                        key={teacher.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        className="border-b border-border/30 last:border-b-0"
                      >
                        <TableCell>
                          <Avatar className="h-9 w-9 border-2 border-primary/20">
                            <AvatarImage src="/placeholder.svg" alt={teacher.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">{teacher.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{teacher.id}</TableCell>
                        <TableCell className="text-foreground">{teacher.name}</TableCell>
                        <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            teacher.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700" :
                            teacher.status === "inactive" ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-700" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700"
                          }>
                            {teacher.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={teacher.faceRegistered ? "default" : "outline"} className={teacher.faceRegistered ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}>
                            {teacher.faceRegistered ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {teacher.faceRegistered ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!teacher.faceRegistered && appConfig.features.faceRecognition && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRegisterFaceClick(teacher)}
                              className="mr-2 h-8 px-3 text-primary hover:bg-primary/10 border-primary/50 transition-all duration-200"
                              disabled={isRegisteringFace}
                            >
                              <Camera className="h-4 w-4 mr-2" /> Register Face
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 w-8 p-0 transition-all duration-200">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-8 w-8 p-0 transition-all duration-200">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No teachers found matching the criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isRegisterFaceDialogOpen} onOpenChange={setIsRegisterFaceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card/90 backdrop-blur-md border-border shadow-2xl" variants={dialogVariants} initial="hidden" animate="visible" exit="exit">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Register Face for {currentTeacherForFaceReg?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Position your face clearly in the camera and click 'Capture Face'.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <motion.div 
              className="animate-fade-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FaceScanCamera videoRef={videoRef} isCameraActive={isCameraActive} />
              <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for actual image capture */}
            </motion.div>
            <Button onClick={captureFaceForRegistration} className="w-full h-12 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg" disabled={isRegisteringFace}>
              {isRegisteringFace ? "Capturing..." : "Capture Face"}
            </Button>
            <Button onClick={() => { setIsCameraActive(false); setIsRegisterFaceDialogOpen(false); setCurrentTeacherForFaceReg(null); }} variant="outline" className="w-full h-12 text-lg font-semibold border-border text-foreground hover:bg-accent transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Separator className="my-8 bg-border/50" />

      <motion.div
        className="text-center text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-lg">Additional teacher details and bulk actions can be added here.</p>
      </motion.div>
    </motion.div>
  );
};

export default TeachersPage;