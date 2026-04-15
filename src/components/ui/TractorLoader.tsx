import { motion } from "framer-motion";

interface TractorLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const TractorLoader = ({ size = "md", className = "" }: TractorLoaderProps) => {
  const sizeMap = { sm: 48, md: 64, lg: 96 };
  const s = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: s * 2, height: s }}>
      {/* Ground line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/30 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Dust particles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{ width: 4 + i * 2, height: 4 + i * 2, bottom: 4 + i * 3 }}
          initial={{ left: "30%", opacity: 0 }}
          animate={{ left: "-10%", opacity: [0, 0.6, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Tractor SVG */}
      <motion.svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: s, height: s * 0.6 }}
        animate={{ x: [-4, 4, -4] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Body */}
        <rect x="30" y="15" width="40" height="25" rx="4" className="fill-primary" />
        {/* Cabin */}
        <rect x="42" y="5" width="22" height="18" rx="3" className="fill-primary/80" />
        {/* Window */}
        <rect x="46" y="8" width="14" height="10" rx="2" className="fill-primary-foreground/30" />
        {/* Exhaust pipe */}
        <rect x="32" y="8" width="3" height="10" rx="1.5" className="fill-muted-foreground/60" />
        {/* Hood */}
        <rect x="18" y="22" width="16" height="14" rx="2" className="fill-primary/90" />
        {/* Front grille */}
        <rect x="16" y="25" width="4" height="8" rx="1" className="fill-primary-foreground/20" />

        {/* Rear wheel */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{ originX: "55px", originY: "48px" }}
        >
          <circle cx="55" cy="48" r="12" className="stroke-foreground/80" strokeWidth="3" fill="none" />
          <circle cx="55" cy="48" r="5" className="fill-foreground/40" />
          {/* Spokes */}
          <line x1="55" y1="37" x2="55" y2="42" className="stroke-foreground/50" strokeWidth="1.5" />
          <line x1="55" y1="54" x2="55" y2="59" className="stroke-foreground/50" strokeWidth="1.5" />
          <line x1="44" y1="48" x2="49" y2="48" className="stroke-foreground/50" strokeWidth="1.5" />
          <line x1="61" y1="48" x2="66" y2="48" className="stroke-foreground/50" strokeWidth="1.5" />
        </motion.g>

        {/* Front wheel */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          style={{ originX: "22px", originY: "48px" }}
        >
          <circle cx="22" cy="48" r="8" className="stroke-foreground/80" strokeWidth="2.5" fill="none" />
          <circle cx="22" cy="48" r="3" className="fill-foreground/40" />
          <line x1="22" y1="41" x2="22" y2="44" className="stroke-foreground/50" strokeWidth="1.5" />
          <line x1="22" y1="52" x2="22" y2="55" className="stroke-foreground/50" strokeWidth="1.5" />
          <line x1="15" y1="48" x2="18" y2="48" className="stroke-foreground/50" strokeWidth="1.5" />
          <line x1="26" y1="48" x2="29" y2="48" className="stroke-foreground/50" strokeWidth="1.5" />
        </motion.g>

        {/* Smoke puffs */}
        <motion.circle
          cx="33" cy="6" r="2.5"
          className="fill-muted-foreground/30"
          animate={{ cy: [6, -4], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle
          cx="35" cy="4" r="2"
          className="fill-muted-foreground/20"
          animate={{ cy: [4, -6], opacity: [0.4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
        />
      </motion.svg>
    </div>
  );
};
