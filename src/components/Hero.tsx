"use client";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="px-6 pt-24 pb-10 text-center max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="text-5xl sm:text-7xl font-semibold tracking-tight"
      >
        mynd
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
        className="mt-4 text-xl text-neutral-500"
      >
        An AI product navigator that reasons, calls tools, and ships.
      </motion.p>
    </section>
  );
}
