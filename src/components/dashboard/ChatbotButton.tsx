import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

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
              <div className="bg-primary/10 text-sm p-3 rounded-lg">
                <p className="font-medium mb-1">Hello! 👋</p>
                <p className="text-muted-foreground">
                  I'm your AI farming assistant. Ask me anything about crops, weather, pests, or government schemes!
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
              disabled
            />
            <Button size="sm">Send</Button>
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
