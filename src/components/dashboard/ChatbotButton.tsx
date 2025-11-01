import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your AI farming assistant. Ask me anything about crops, weather, pests, or government schemes!"
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

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: newMessages },
      });

      if (error) throw error;

      // Parse the streaming response
      if (data) {
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6);
              if (jsonStr === "[DONE]") continue;
              
              try {
                const json = JSON.parse(jsonStr);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setMessages(newMessages);
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
        <Card className="fixed bottom-24 right-4 w-80 md:w-96 h-[500px] z-50 p-4 bg-card border-border shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">AI Farm Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="h-[calc(100%-100px)] bg-muted/30 rounded-lg p-4 mb-4 overflow-y-auto">
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
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
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
