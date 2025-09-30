import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import ChatThread from "./pages/ChatThread";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Social from "./pages/Social";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">BuddyBurn</h1>
        <p className="text-xl">App is loading...</p>
        <div className="mt-8 space-y-2">
          <a href="/auth" className="block text-blue-200 hover:underline">Go to Auth</a>
          <a href="/schedule" className="block text-blue-200 hover:underline">Go to Schedule</a>
          <a href="/profile" className="block text-blue-200 hover:underline">Go to Profile</a>
        </div>
      </div>
    </div>
  );
};

export default App;
