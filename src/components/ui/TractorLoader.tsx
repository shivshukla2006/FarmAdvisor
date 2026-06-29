import { motion } from "framer-motion";

interface TractorLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  showWordmark?: boolean;
}

/**
 * Branded FarmAdvisor loading animation.
 * - Pulsing sprout logo (matches brand mark used in Header)
 * - Growing leaves + rotating sun rays
 * - Orbiting seed particles
 * - Shimmering "FarmAdvisor" wordmark
 *
 * Kept as TractorLoader export for backwards compatibility across the app.
 */
export const TractorLoader = ({
  size = "md",
  className = "",
  label,
  showWordmark = true,
}: TractorLoaderProps) => {
  const sizeMap = { sm: 56, md: 88, lg: 128 };
  const s = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative" style={{ width: s, height: s }}>
        {/* Rotating sun rays */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0"
          style={{ width: s, height: s }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            return (
              <line
                key={i}
                x1="50"
                y1="6"
                x2="50"
                y2="14"
                className="stroke-accent"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
                opacity={0.55}
              />
            );
          })}
        </motion.svg>

        {/* Soft glow halo */}
        <motion.div
          className="absolute inset-[18%] rounded-full bg-primary/15 blur-xl"
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dashed soil ring */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0"
          style={{ width: s, height: s }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            className="stroke-primary/40"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
        </motion.svg>

        {/* Orbiting seeds */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ width: 0, height: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * (3.5 / 3),
            }}
          >
            <div
              className="absolute rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]"
              style={{
                width: 6,
                height: 6,
                transform: `translate(-50%, -50%) translateY(-${s * 0.34}px)`,
              }}
            />
          </motion.div>
        ))}

        {/* Central sprout logo (matches brand) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary drop-shadow-[0_2px_8px_hsl(var(--primary)/0.5)]"
            style={{ width: s * 0.5, height: s * 0.5 }}
          >
            {/* Stem */}
            <motion.path
              d="M7 20h10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M12 20v-7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
            {/* Left leaf */}
            <motion.path
              d="M12 13c-3 0-6-2-6-6 3 0 6 2 6 6z"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.2 }}
            />
            {/* Right leaf */}
            <motion.path
              d="M12 13c3 0 6-2 6-6-3 0-6 2-6 6z"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.2 }}
            />
          </svg>
        </motion.div>
      </div>

      {showWordmark && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative overflow-hidden">
            <span
              className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent"
              style={{ animation: "shimmer 2.4s linear infinite" }}
            >
              FarmAdvisor
            </span>
          </div>
          <motion.span
            className="text-xs text-muted-foreground"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {label ?? "Growing your insights…"}
          </motion.span>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
