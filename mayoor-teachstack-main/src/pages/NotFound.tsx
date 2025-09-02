import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion"; // Import motion
import Layout from "@/components/layout/Layout"; // Import Layout

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <Layout>
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center bg-card/80 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-border/50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-red-400 drop-shadow-lg"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            404
          </motion.h1>
          <motion.p
            className="text-2xl text-foreground mb-6"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            Oops! Page not found
          </motion.p>
          <motion.a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.08, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
          >
            Return to Home
          </motion.a>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default NotFound;