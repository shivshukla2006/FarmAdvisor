import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatbotButton = () => {
  const { isOpen, closeChatbot, toggleChatbot } = useChatbot();
  const { user } = useAuth();
  const CHATBOT_NAME = "Kisan Mitra";
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Namaste! 🙏 I'm ${CHATBOT_NAME}, your friendly farming assistant. Ask me anything about crops, weather, pests, or government schemes!`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the chatbot.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch (e) {
            console.error("JSON parse error:", e, "Line:", jsonStr);
          }
        }
      }

      if (!assistantMessage) {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
      // Remove user message on error
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && (
        <Card className="fixed top-20 right-4 w-80 md:w-96 h-[550px] z-50 p-4 bg-card border-border shadow-lg animate-scale-in">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">AI Assistant</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={closeChatbot}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mascot Header */}
          <div className="flex flex-col items-center mb-4 pb-3 border-b border-border">
            <div className="relative">
              {/* Cartoon Farmer Mascot */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center text-4xl animate-bounce-slow">
                👨‍🌾
              </div>
              {/* Speech bubble */}
              <div className="absolute -right-2 -top-1 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded-full font-medium animate-pulse">
                Hi!
              </div>
            </div>
            <h3 className="font-heading font-bold text-lg text-primary mt-2">{CHATBOT_NAME}</h3>
            <p className="text-xs text-muted-foreground">Ask me anything about farming!</p>
          </div>
          
          <div className="h-[calc(100%-180px)] bg-muted/30 rounded-lg p-3 mb-3 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`text-sm p-3 rounded-lg ${
                    message.role === "assistant"
                      ? "bg-primary/10"
                      : "bg-secondary/10 ml-auto max-w-[85%]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              size="sm" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
      
      <Button
        size="lg"
        className="fixed top-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
        onClick={toggleChatbot}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
    </>
  );
};
