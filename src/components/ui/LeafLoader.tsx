import { motion } from "framer-motion";

interface LeafLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LeafLoader = ({ size = "sm", className = "" }: LeafLoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-8",
    md: "w-8 h-10",
    lg: "w-10 h-14",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 24 32"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Leaf stem */}
        <motion.path
          d="M12 32 L12 16"
          stroke="hsl(var(--primary))"
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

        {/* Leaf shape */}
        <motion.path
          d="M12 2 C6 6 4 12 6 16 C8 20 12 20 12 16 C12 20 16 20 18 16 C20 12 18 6 12 2 Z"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Leaf vein */}
        <motion.path
          d="M12 4 L12 14"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glow effect - bottom to top */}
        <defs>
          <linearGradient id="leafGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated glow sweep */}
        <motion.rect
          x="4"
          y="0"
          width="16"
          height="8"
          fill="url(#leafGlow)"
          filter="url(#glow)"
          initial={{ y: 28 }}
          animate={{ y: -8 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};
