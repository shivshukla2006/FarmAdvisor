import { motion } from "framer-motion";
import { CloudRain, Wind, Droplets, Sun, Cloud, CloudSnow, Moon, CloudLightning, CloudFog } from "lucide-react";

interface AnimatedWeatherIconProps {
  description: string;
  isNight: boolean;
  size?: "sm" | "md" | "lg";
}

export const AnimatedWeatherIcon = ({ description, isNight, size = "md" }: AnimatedWeatherIconProps) => {
  const desc = description.toLowerCase();
  
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const iconSize = sizeClasses[size];

  // Rain animation - drops falling
  if (desc.includes("rain") || desc.includes("drizzle")) {
    return (
      <motion.div className="relative">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CloudRain className={`${iconSize} text-primary`} />
        </motion.div>
        {/* Rain drops */}
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, 4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        >
          <Droplets className="h-3 w-3 text-primary opacity-60" />
        </motion.div>
      </motion.div>
    );
  }

  // Thunderstorm animation - flash effect
  if (desc.includes("thunder") || desc.includes("storm")) {
    return (
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
        }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        <CloudLightning className={`${iconSize} text-accent`} />
      </motion.div>
    );
  }

  // Snow animation - gentle floating
  if (desc.includes("snow")) {
    return (
      <motion.div
        animate={{ 
          y: [0, -2, 0],
          rotate: [-2, 2, -2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSnow className={`${iconSize} text-primary`} />
      </motion.div>
    );
  }

  // Fog/Mist animation - subtle fade
  if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze")) {
    return (
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudFog className={`${iconSize} text-muted-foreground`} />
      </motion.div>
    );
  }

  // Cloudy animation - gentle drift
  if (desc.includes("cloud") || desc.includes("overcast")) {
    return (
      <motion.div
        animate={{ x: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className={`${iconSize} text-muted-foreground`} />
      </motion.div>
    );
  }

  // Wind animation
  if (desc.includes("wind") || desc.includes("breez")) {
    return (
      <motion.div
        animate={{ 
          x: [-3, 3, -3],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wind className={`${iconSize} text-secondary`} />
      </motion.div>
    );
  }

  // Clear weather - Sun or Moon based on time
  if (isNight) {
    return (
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Moon className={`${iconSize} text-indigo-400`} />
        {/* Stars twinkling effect */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <span className="text-[8px] text-indigo-300">✦</span>
        </motion.div>
      </motion.div>
    );
  }

  // Daytime sun - rotating rays
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sun className={`${iconSize} text-accent`} />
      </motion.div>
    </motion.div>
  );
};
