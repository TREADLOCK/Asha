import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Menu = () => {
  return (
    <div className="fixed top-8 right-8 z-50">
       <MagneticButton>
         <div className="w-12 h-12 bg-white rounded-full flex flex-col justify-center items-center gap-1.5 cursor-pointer hover:scale-110 transition-transform duration-300">
            <div className="w-6 h-0.5 bg-brand-black" />
            <div className="w-6 h-0.5 bg-brand-black" />
         </div>
       </MagneticButton>
    </div>
  );
};

const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.5, y: middleY * 0.5 }); // Magnetic strength
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  }

  const { x, y } = position;
  return (
      <motion.div
          style={{ position: 'relative' }}
          ref={ref}
          onMouseMove={handleMouse}
          onMouseLeave={reset}
          animate={{ x, y }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
          {children}
      </motion.div>
  )
}

export default Menu;
