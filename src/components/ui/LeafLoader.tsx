import { motion } from "framer-motion";

interface LeafLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LeafLoader = ({ size = "sm", className = "" }: LeafLoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-10",
    md: "w-8 h-12",
    lg: "w-12 h-16",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 48"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wheat stem */}
        <motion.path
          d="M16 48 L16 12"
          stroke="#8B6914"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />

        {/* Wheat grains - left side */}
        <motion.ellipse cx="13" cy="10" rx="3" ry="5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        />
        <motion.ellipse cx="12" cy="18" rx="3" ry="5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        />
        <motion.ellipse cx="13" cy="26" rx="3" ry="5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Wheat grains - right side */}
        <motion.ellipse cx="19" cy="10" rx="3" ry="5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.05 }}
        />
        <motion.ellipse cx="20" cy="18" rx="3" ry="5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.ellipse cx="19" cy="26" rx="3" ry="5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
        />

        {/* Top grain */}
        <motion.ellipse cx="16" cy="4" rx="2.5" ry="4.5" fill="#DAA520"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Awns (whiskers) at top */}
        <motion.path d="M16 0 L14 -2" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"
          initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path d="M16 0 L18 -2" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"
          initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        />
        <motion.path d="M16 0 L16 -3" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"
          initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />

        {/* Glow effect - bottom to top */}
        <defs>
          <linearGradient id="wheatGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DAA520" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#DAA520" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated glow sweep */}
        <motion.rect
          x="8"
          y="0"
          width="16"
          height="10"
          fill="url(#wheatGlow)"
          filter="url(#glow)"
          initial={{ y: 44 }}
          animate={{ y: -10 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};
