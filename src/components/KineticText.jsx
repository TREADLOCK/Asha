/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function KineticText({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: 1.2,
          ease: [0.33, 1, 0.68, 1], // The "Manufacturer" Curve
          delay: delay
        }}
        className="block origin-top-left"
      >
        {children}
      </motion.div>
    </div>
  );
}
