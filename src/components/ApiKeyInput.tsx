import { useState } from "react";
import { Key, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const apiKeySchema = z.string()
  .trim()
  .min(30, "API key too short")
  .max(100, "API key too long")
  .regex(/^AIza[0-9A-Za-z-_]{35}$/, "Invalid Google Maps API key format");

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isStored, setIsStored] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (apiKey.trim()) {
      // Validate API key format
      const validation = apiKeySchema.safeParse(apiKey);
      if (!validation.success) {
        toast({
          title: "Invalid API Key",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      // Store in localStorage for this session
      localStorage.setItem('google_maps_api_key', validation.data);
      onApiKeySet(validation.data);
      setIsStored(true);
      toast({
        title: "Success",
        description: "Google Maps API key saved successfully",
      });
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('google_maps_api_key');
    setApiKey("");
    setIsStored(false);
    onApiKeySet("");
  };

  // Check if key exists in localStorage on component mount
  useState(() => {
    const storedKey = localStorage.getItem('google_maps_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      onApiKeySet(storedKey);
      setIsStored(true);
    }
  });

  if (isStored) {
    return (
      <Card className="p-4 border-fitness-success/20 bg-fitness-success/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-fitness-success" />
            <span className="text-sm font-medium text-fitness-success">
              Google Maps API Key Connected
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearKey}
            className="text-xs"
          >
            Change Key
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          To find gyms and fitness centers, you need a Google Maps API key. 
          <a 
            href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 ml-1 text-primary hover:underline"
          >
            Get one here <ExternalLink className="w-3 h-3" />
          </a>
        </AlertDescription>
      </Alert>

      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground">
              Google Maps API Key
            </label>
            <p className="text-xs text-muted-foreground">
              Your API key will be stored locally in your browser for this session only.
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <Button
              onClick={handleSubmit}
              variant="fitness"
              size="sm"
              disabled={!apiKey.trim()}
            >
              Connect
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApiKeyInput;