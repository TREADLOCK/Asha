/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const PrototypeViewer = ({ title, embedUrl }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-6xl mx-auto my-32 p-1"
    >
      <div className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
        {/* Window Header */}
        <div className="h-10 bg-black/40 flex items-center px-4 space-x-2 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          <span className="ml-4 font-mono text-xs text-white/40 uppercase tracking-widest">{title} // PROTOTYPE</span>
        </div>

        {/* Embed Container */}
        <div className="aspect-[16/9] w-full bg-black relative group">
          {embedUrl ? (
            <iframe 
              src={embedUrl}
              className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
               <span className="font-display text-4xl font-bold mb-4">FIGMA PROTOTYPE</span>
               <span className="font-mono text-sm border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
                 LOAD EXPERIENCE ↗
               </span>
            </div>
          )}
          
          {/* Overlay Glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
};

export default PrototypeViewer;
