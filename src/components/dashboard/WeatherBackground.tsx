import { motion } from "framer-motion";
import { WeatherData } from "@/services/weatherService";

interface WeatherBackgroundProps {
  weather: WeatherData | null;
  children: React.ReactNode;
  className?: string;
}

type TimeOfDay = "dawn" | "morning" | "afternoon" | "sunset" | "dusk" | "night";

const getTimeOfDay = (weather: WeatherData | null): TimeOfDay => {
  const now = Math.floor(Date.now() / 1000);
  
  if (weather?.sunrise && weather?.sunset) {
    const sunrise = weather.sunrise;
    const sunset = weather.sunset;
    const dayLength = sunset - sunrise;
    
    // Dawn: 30 min before sunrise to sunrise
    if (now >= sunrise - 1800 && now < sunrise) return "dawn";
    // Morning: sunrise to 2 hours after
    if (now >= sunrise && now < sunrise + 7200) return "morning";
    // Afternoon: 2 hours after sunrise to 2 hours before sunset
    if (now >= sunrise + 7200 && now < sunset - 7200) return "afternoon";
    // Sunset: 2 hours before sunset to sunset
    if (now >= sunset - 7200 && now < sunset) return "sunset";
    // Dusk: sunset to 1 hour after
    if (now >= sunset && now < sunset + 3600) return "dusk";
    // Night: everything else
    return "night";
  }
  
  // Fallback to local time
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 19) return "sunset";
  if (hour >= 19 && hour < 21) return "dusk";
  return "night";
};

const getWeatherGradient = (weather: WeatherData | null): string => {
  const timeOfDay = getTimeOfDay(weather);
  const description = weather?.description?.toLowerCase() || "";
  
  // Weather condition overrides
  if (description.includes("thunder") || description.includes("storm")) {
    return "bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900";
  }
  
  if (description.includes("rain") || description.includes("drizzle")) {
    if (timeOfDay === "night" || timeOfDay === "dusk") {
      return "bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900";
    }
    return "bg-gradient-to-br from-slate-500 via-slate-400 to-blue-500";
  }
  
  if (description.includes("snow")) {
    return "bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300";
  }
  
  if (description.includes("fog") || description.includes("mist") || description.includes("haze")) {
    return "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400";
  }
  
  if (description.includes("cloud") || description.includes("overcast")) {
    if (timeOfDay === "night") {
      return "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900";
    }
    if (timeOfDay === "sunset" || timeOfDay === "dusk") {
      return "bg-gradient-to-br from-orange-300/50 via-slate-400 to-purple-400/50";
    }
    return "bg-gradient-to-br from-slate-300 via-blue-200 to-slate-400";
  }
  
  // Clear weather - time-based gradients
  switch (timeOfDay) {
    case "dawn":
      return "bg-gradient-to-br from-indigo-400 via-pink-300 to-orange-300";
    case "morning":
      return "bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200";
    case "afternoon":
      return "bg-gradient-to-br from-sky-500 via-blue-400 to-cyan-300";
    case "sunset":
      return "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500";
    case "dusk":
      return "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400";
    case "night":
      return "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800";
    default:
      return "bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200";
  }
};

const getTextColorClass = (weather: WeatherData | null): string => {
  const timeOfDay = getTimeOfDay(weather);
  const description = weather?.description?.toLowerCase() || "";
  
  // Dark backgrounds need light text
  const isDarkTime = timeOfDay === "night" || timeOfDay === "dusk";
  const isStormyWeather = description.includes("thunder") || description.includes("storm");
  const isRainyNight = description.includes("rain") && isDarkTime;
  
  if (isDarkTime || isStormyWeather || isRainyNight || timeOfDay === "sunset") {
    return "text-white";
  }
  
  return "text-slate-800";
};

export const WeatherBackground = ({ weather, children, className = "" }: WeatherBackgroundProps) => {
  const gradient = getWeatherGradient(weather);
  const textColor = getTextColorClass(weather);
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${gradient} ${textColor} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated overlay effects based on weather */}
      <WeatherEffects weather={weather} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const WeatherEffects = ({ weather }: { weather: WeatherData | null }) => {
  const description = weather?.description?.toLowerCase() || "";
  const timeOfDay = getTimeOfDay(weather);
  
  // Rain effect
  if (description.includes("rain") || description.includes("drizzle")) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-4 bg-blue-300/30 rounded-full"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }
  
  // Snow effect
  if (description.includes("snow")) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{
              y: ["0vh", "100vh"],
              x: [0, Math.random() * 20 - 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }
  
  // Stars for night
  if (timeOfDay === "night" && !description.includes("cloud") && !description.includes("rain")) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 60}%` 
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  }
  
  // Clouds for cloudy weather
  if (description.includes("cloud")) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-16 bg-white/20 rounded-full blur-xl"
            style={{ top: `${20 + i * 20}%` }}
            animate={{
              x: ["-20%", "120%"],
            }}
            transition={{
              duration: 30 + i * 10,
              repeat: Infinity,
              delay: i * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }
  
  return null;
};

export { getWeatherGradient, getTextColorClass, getTimeOfDay };
