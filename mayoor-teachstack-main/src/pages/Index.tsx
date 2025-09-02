import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion
import Layout from "@/components/layout/Layout"; // Import Layout

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1500); // Redirect after 1.5 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <Layout>
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <motion.h1
            className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 drop-shadow-lg"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Loading TeachStack...
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground dark:text-gray-400"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            Redirecting to login page.
          </motion.p>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;