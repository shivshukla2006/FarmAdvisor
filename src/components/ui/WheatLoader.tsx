import { motion } from "framer-motion";

interface WheatLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const WheatLoader = ({ size = "md", className = "" }: WheatLoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-12",
    md: "w-12 h-16",
    lg: "w-16 h-24",
  };

  const grainSizes = {
    sm: { width: 4, height: 8, gap: 2 },
    md: { width: 6, height: 12, gap: 3 },
    lg: { width: 8, height: 16, gap: 4 },
  };

  const { width, height, gap } = grainSizes[size];

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 48 72"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wheat stem */}
        <motion.path
          d="M24 72 L24 20"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />

        {/* Left grains */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.ellipse
            key={`left-${i}`}
            cx={16}
            cy={18 + i * 10}
            rx={6}
            ry={4}
            fill="hsl(var(--primary))"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.1, 0.8],
              filter: [
                "drop-shadow(0 0 0px hsl(var(--primary)))",
                "drop-shadow(0 0 8px hsl(var(--primary)))",
                "drop-shadow(0 0 0px hsl(var(--primary)))",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: (4 - i) * 0.15,
              ease: "easeInOut",
            }}
            transform={`rotate(-30 16 ${18 + i * 10})`}
          />
        ))}

        {/* Right grains */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.ellipse
            key={`right-${i}`}
            cx={32}
            cy={18 + i * 10}
            rx={6}
            ry={4}
            fill="hsl(var(--primary))"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.1, 0.8],
              filter: [
                "drop-shadow(0 0 0px hsl(var(--primary)))",
                "drop-shadow(0 0 8px hsl(var(--primary)))",
                "drop-shadow(0 0 0px hsl(var(--primary)))",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: (4 - i) * 0.15,
              ease: "easeInOut",
            }}
            transform={`rotate(30 32 ${18 + i * 10})`}
          />
        ))}

        {/* Top grain */}
        <motion.ellipse
          cx={24}
          cy={8}
          rx={5}
          ry={7}
          fill="hsl(var(--primary))"
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.1, 0.8],
            filter: [
              "drop-shadow(0 0 0px hsl(var(--primary)))",
              "drop-shadow(0 0 12px hsl(var(--primary)))",
              "drop-shadow(0 0 0px hsl(var(--primary)))",
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0,
            ease: "easeInOut",
          }}
        />

        {/* Glow effect gradient overlay - bottom to top */}
        <defs>
          <linearGradient id="wheatGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <motion.stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0"
              animate={{ stopOpacity: [0, 0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.stop
              offset="50%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.5"
              animate={{ offset: ["0%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.stop
              offset="100%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0"
              animate={{ stopOpacity: [0, 0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </linearGradient>
        </defs>

        {/* Animated glow overlay */}
        <motion.rect
          x="8"
          y="0"
          width="32"
          height="72"
          fill="url(#wheatGlow)"
          initial={{ y: 72 }}
          animate={{ y: -72 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};
