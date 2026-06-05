'use client';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center pt-32 pb-16 text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-6xl font-semibold tracking-tight text-ink"
      >
        mynd-plan
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-xl text-xl text-ink-soft"
      >
        An AI product navigator that reasons, calls tools, and ships. Built on the Brief architecture pattern.
      </motion.p>
    </section>
  );
}
