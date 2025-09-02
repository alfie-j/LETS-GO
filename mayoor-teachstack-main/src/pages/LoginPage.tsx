import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Camera, Mail, Lock } from 'lucide-react'; // Added icons
import FaceScanCamera from '@/components/FaceScanCamera'; // Import the new component

const LoginPage = () => {
  const { login, appConfig } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // This canvas remains hidden for image capture
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFaceLoginAttempt, setIsFaceLoginAttempt] = useState(false);
  const [isEmailLoginAttempt, setIsEmailLoginAttempt] = useState(false);

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
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleFaceLogin = async () => {
    if (!appConfig.features.faceRecognition) {
      showError("Face recognition is not enabled in this application.");
      return;
    }
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        // Draw the current video frame to the hidden canvas for capture
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        setIsFaceLoginAttempt(true);
        try {
          await login(undefined, undefined, imageData);
          showSuccess("Face login successful!");
        } catch (error) {
          // Error handled by AppContext, just reset loading state
        } finally {
          setIsFaceLoginAttempt(false);
        }
      }
    } else {
      showError("Camera not active or elements not ready.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoginAttempt(true);
    try {
      await login(email, otp);
      showSuccess("Email/OTP login successful!");
    } catch (error) {
      // Error handled by AppContext, just reset loading state
    } finally {
      setIsEmailLoginAttempt(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4 relative overflow-hidden">
      {/* Background animation elements */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)`,
          backgroundSize: '150% 150%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />
      <motion.div 
        className="absolute inset-0 z-0 bg-grid-pattern opacity-5 dark:opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1, delay: 0.7 }}
      />

      <motion.div
        className="w-full max-w-md z-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-2xl border-primary/20 backdrop-blur-lg bg-card/80">
          <CardHeader className="space-y-1 text-center">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Welcome to {appConfig.appName}
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants} transition={{ delay: 0.1 }}>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Securely access your dashboard with cutting-edge authentication.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-8">
            {appConfig.features.faceRecognition && (
              <motion.div variants={itemVariants} transition={{ delay: 0.2 }} className="space-y-4">
                <h3 className="text-2xl font-semibold text-center text-foreground flex items-center justify-center gap-2">
                  <Camera className="h-6 w-6 text-primary" /> Face Recognition Login
                </h3>
                <div className="flex justify-center">
                  {!isCameraActive ? (
                    <Button 
                      onClick={() => setIsCameraActive(true)} 
                      className="w-full max-w-[250px] h-12 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Activate Camera
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsCameraActive(false)} 
                      variant="outline" 
                      className="w-full max-w-[250px] h-12 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Deactivate Camera
                    </Button>
                  )}
                </div>
                {isCameraActive && (
                  <motion.div 
                    className="animate-fade-in"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <FaceScanCamera videoRef={videoRef} isCameraActive={isCameraActive} />
                    <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for actual image capture */}
                    <Button 
                      onClick={handleFaceLogin} 
                      className="mt-4 w-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                      disabled={isFaceLoginAttempt}
                    >
                      {isFaceLoginAttempt ? "Logging in..." : "Login with Face"}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            <motion.div variants={itemVariants} transition={{ delay: 0.4 }} className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">Or continue with</span>
            </motion.div>

            <motion.form onSubmit={handleEmailLogin} variants={itemVariants} transition={{ delay: 0.5 }} className="space-y-6">
              <h3 className="text-2xl font-semibold text-center text-foreground flex items-center justify-center gap-2">
                <Mail className="h-6 w-6 text-primary" /> Email & OTP Login
              </h3>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.ali@teachstack.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-muted-foreground text-base">OTP / 2FA Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-12 text-base transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl bg-primary text-primary-foreground hover:bg-primary/90" 
                disabled={isEmailLoginAttempt}
              >
                {isEmailLoginAttempt ? "Logging in..." : "Login with Email & OTP"}
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;