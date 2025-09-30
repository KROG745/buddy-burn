import { Home, Calendar, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "schedule", icon: Calendar, label: "Schedule", path: "/schedule" },
    { id: "chat", icon: MessageCircle, label: "Chat", path: "/chat" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/chat")) return "chat";
    if (location.pathname === "/schedule") return "schedule";
    if (location.pathname === "/profile") return "profile";
    return "home";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevation z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getActiveTab() === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-all duration-300 ${
                  isActive ? "fill-current" : ""
                }`} 
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full absolute -top-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;