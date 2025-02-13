import { useLocation } from "react-router-dom";

import { motion } from "framer-motion";

export const AuthBanner = () => {
  const location = useLocation();
  const skipImageAnimation = location.state?.from === "/signin" || location.state?.from === "/signup";

  return (
    <motion.div
      className="relative h-full w-full"
      initial={skipImageAnimation ? false : { x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1735534151807-17f107a64cf6?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex h-full flex-col justify-end p-20">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            Write
          </motion.span>{" "}
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            Today,
          </motion.span>
          <br />
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}>
            Shape
          </motion.span>{" "}
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }}>
            Tomorrow
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md text-xl text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          당신의 성장을 기록하는 공간
        </motion.p>
      </div>
    </motion.div>
  );
};
