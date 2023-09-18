import { motion } from "framer-motion";
import React from "react";

export const Overlay = ({
  children,
  close,
  blackBackdrop,
}: {
  children?: React.ReactNode;
  close?: () => void;
  blackBackdrop?: boolean;
}) => {
  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center z-20 ${
        blackBackdrop
          ? "bg-black bg-opacity-30"
          : "backdrop-blur-sm bg-white/25"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "tween" }}
      onClick={close}
    >
      {children}
    </motion.div>
  );
};
