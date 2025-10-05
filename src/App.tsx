import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import ChatThread from "./pages/ChatThread";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AchievementDemo from "./pages/AchievementDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WorkoutProvider>
      <ConversationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:contactId" element={<ChatThread />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/achievement-demo" element={<AchievementDemo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConversationProvider>
    </WorkoutProvider>
  </QueryClientProvider>
);

export default App;
