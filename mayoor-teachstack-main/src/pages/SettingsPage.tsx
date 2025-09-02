"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, Info, Settings as SettingsIcon, Shield, Bell, Palette, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion'; // For advanced animations

const SettingsPage = () => {
  const { isLoggedIn, theme, toggleTheme, appConfig } = useAppContext();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Please log in to view settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.01, boxShadow: "0 8px 16px rgba(0,0,0,0.1)", transition: { duration: 0.2 } },
  };

  const switchVariants = {
    checked: { backgroundColor: "hsl(var(--primary))", transition: { duration: 0.3 } },
    unchecked: { backgroundColor: "hsl(var(--muted))", transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Application Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-l-4 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <SettingsIcon className="h-6 w-6 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">Configure application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.005 }}
              >
                <Label htmlFor="theme-toggle" className="flex items-center gap-2 text-lg text-foreground">
                  {theme === "dark" ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                  Dark Mode
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground"
                />
              </motion.div>
              <Separator className="bg-border/50" />
              <motion.div
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.005 }}
              >
                <Label className="text-lg flex items-center gap-2 text-foreground">
                  <Palette className="h-5 w-5 text-purple-500" />
                  Color Theme
                </Label>
                <Badge variant="outline" className="bg-accent text-accent-foreground border-accent/50">Default</Badge>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-l-4 border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <Shield className="h-6 w-6 text-blue-600" />
                Security & Features
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">Manage security settings and feature toggles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.005 }}
              >
                <Label className="text-lg text-foreground">Face Recognition</Label>
                <Badge variant={appConfig.features.faceRecognition ? "default" : "destructive"} className={appConfig.features.faceRecognition ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}>
                  {appConfig.features.faceRecognition ? "Enabled" : "Disabled"}
                </Badge>
              </motion.div>
              <Separator className="bg-border/50" />
              <motion.div
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.005 }}
              >
                <Label className="text-lg text-foreground">AI Insights</Label>
                <Badge variant={appConfig.features.aiInsights ? "default" : "destructive"} className={appConfig.features.aiInsights ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}>
                  {appConfig.features.aiInsights ? "Enabled" : "Disabled"}
                </Badge>
              </motion.div>
              <Separator className="bg-border/50" />
              <motion.div
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                whileHover={{ backgroundColor: "hsl(var(--muted)/70%)", scale: 1.005 }}
              >
                <Label className="text-lg flex items-center gap-2 text-foreground">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Notifications
                </Label>
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} whileHover="hover">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <Database className="h-6 w-6 text-green-600" />
              Data & Storage
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">Information about data usage and storage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200">
                <p className="font-medium text-blue-800 dark:text-blue-200">Storage Used</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">2.4 GB</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">of 10 GB</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-200">
                <p className="font-medium text-green-800 dark:text-green-200">Data Sync</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">Active</p>
                <p className="text-xs text-green-700 dark:text-green-300">Last sync: Just now</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 transition-all duration-200">
                <p className="font-medium text-amber-800 dark:text-amber-200">Backup Status</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">Enabled</p>
                <p className="text-xs text-amber-700 dark:text-amber-300">Daily backups</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} whileHover="hover">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <Info className="h-6 w-6 text-purple-600" />
              About {appConfig.appName}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">Information about the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium text-foreground">Application Name:</p>
                <p className="text-muted-foreground">{appConfig.appName}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Version:</p>
                <p className="text-muted-foreground">{appConfig.version}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">API Base URL:</p>
                <p className="text-muted-foreground text-sm break-all">{appConfig.apiBaseUrl}</p>
              </div>
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
        <p className="text-lg">More advanced settings and integrations will be added here.</p>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;