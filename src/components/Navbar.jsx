import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo3D from './3d/Logo3D';

const Navbar = ({ isEntering }) => {
    const { scrollY } = useScroll();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    
    // Smooth opacity/blur based on scroll
    const navBackground = useTransform(
        scrollY,
        [0, 100],
        ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]
    );
    const navBlur = useTransform(
        scrollY,
        [0, 100],
        ["blur(0px)", "blur(20px)"]
    );

    return (
        <motion.nav 
            style={{ 
                backgroundColor: navBackground,
                backdropFilter: navBlur,
                WebkitBackdropFilter: navBlur
            }}
            className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 md:py-6 flex items-center justify-between"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: isEntering ? -100 : 0, opacity: isEntering ? 0 : 1 }}
            transition={{ duration: 1.4, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* LEFT: Branding */}
            <div className="flex items-center gap-6">
                <motion.button 
                    onClick={() => setIsVoiceActive(!isVoiceActive)}
                    className="group flex items-center gap-5 cursor-pointer"
                    initial="initial"
                    animate={isVoiceActive ? "voice" : "initial"}
                    whileHover={isVoiceActive ? undefined : "hover"}
                >
                    <Logo3D />
                    <div className="h-6 w-px bg-white/10" />
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg viewBox="0 0 40 40" className={`w-full h-full transition-all duration-500 fill-none stroke-current stroke-[1.5] ${isVoiceActive ? 'text-brand-accent' : 'text-white/10 group-hover:text-brand-accent'}`}>
                            {/* Outer Hex */}
                            <path d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" className={`transition-opacity duration-300 ${isVoiceActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                            {/* Inner Hex */}
                            <path d="M20 8 L31 14 L31 26 L20 32 L9 26 L9 14 Z" strokeWidth="1" className="opacity-20 translate-y-px" />
                            
                            {/* Animated Voice Bars (Waveform) */}
                            {[0, 1, 2, 3].map((i) => (
                                <motion.rect 
                                    key={i}
                                    custom={i}
                                    width="3"
                                    rx="1.5"
                                    fill="currentColor"
                                    className={`transition-colors duration-500 ${isVoiceActive ? 'text-brand-white' : 'text-white group-hover:text-brand-accent'}`}
                                    x={9.5 + i * 6}
                                    variants={{
                                        initial: { 
                                            height: 3,
                                            y: 18.5,
                                            opacity: 0.7 
                                        },
                                        hover: { 
                                            height: 3,
                                            y: 18.5,
                                            opacity: 1 
                                        },
                                        voice: (i) => {
                                            const isCenter = i === 1 || i === 2;
                                            return {
                                                height: isCenter ? [12, 20, 12] : [6, 12, 6],
                                                y: isCenter ? [14, 10, 14] : [17, 14, 17],
                                                opacity: 1,
                                                transition: {
                                                    repeat: Infinity,
                                                    duration: 1.2,
                                                    ease: "easeInOut",
                                                    delay: i * 0.15, // Stagger
                                                    repeatType: "loop"
                                                }
                                            };
                                        }
                                    }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            ))}
                        </svg>
                    </div>
                </motion.button>
            </div>

            {/* CENTER: Navigation (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-12">
                {['Home', 'Projects', 'Services'].map((item) => (
                    <a 
                        key={item} 
                        href={`#${item.toLowerCase()}`}
                        className="font-sans text-[11px] tracking-[0.3em] uppercase text-white/50 hover:text-brand-white transition-colors duration-300"
                    >
                        {item}
                    </a>
                ))}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-8">
                <a 
                    href="#contact" 
                    className="group hidden md:flex items-center gap-3 font-sans text-[11px] tracking-[0.3em] uppercase text-white/50 hover:text-brand-white transition-colors duration-300"
                >
                    Let's talk
                    <span className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
                    <div className="h-6 w-px bg-white/10 ml-2" />
                </a>

                {/* Stylized Hamburger */}
                <MagneticControl>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex flex-col gap-1.5 items-end group px-2 py-2"
                    >
                        <motion.div 
                            className="h-px bg-white" 
                            animate={{ width: isMenuOpen ? 24 : 32, rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }}
                        />
                        <motion.div 
                            className="h-px bg-white" 
                            animate={{ width: isMenuOpen ? 0 : 20, opacity: isMenuOpen ? 0 : 1 }}
                        />
                        <motion.div 
                            className="h-px bg-white" 
                            animate={{ width: isMenuOpen ? 24 : 28, rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }}
                        />
                    </button>
                </MagneticControl>
            </div>
        </motion.nav>
    );
};

const MagneticControl = ({ children }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    const { x, y } = position;
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

export default Navbar;
