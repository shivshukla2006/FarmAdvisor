import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ListenButtonProps {
  text: string;
  language?: string;
  size?: "sm" | "default" | "icon";
  variant?: "outline" | "ghost" | "default";
  className?: string;
  label?: string;
}

export const ListenButton = ({ text, language = "en", size = "sm", variant = "outline", className = "", label }: ListenButtonProps) => {
  const { isSpeaking, speak, stop, isSupported } = useTextToSpeech();

  if (!isSupported) return null;

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleClick}
            className={`${isSpeaking ? "text-primary bg-primary/10" : ""} ${className}`}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {label && <span className="ml-1">{label}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isSpeaking ? "Stop listening" : "Listen to result"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
