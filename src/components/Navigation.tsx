import { Home, Calendar, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "schedule", icon: Calendar, label: "Schedule", path: "/schedule" },
    { id: "chat", icon: MessageCircle, label: "Chat", path: "/chat" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/dashboard") return "home";
    if (location.pathname.startsWith("/chat")) return "chat";
    if (location.pathname === "/schedule") return "schedule";
    if (location.pathname === "/profile") return "profile";
    return "home";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-tab-bar z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[49px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getActiveTab() === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 py-1 ios-tap-highlight transition-opacity duration-150"
            >
              <Icon 
                className={`w-[22px] h-[22px] mb-0.5 transition-colors duration-150 ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.5 : 1.5}
                fill={isActive ? "currentColor" : "none"}
              />
              <span 
                className={`text-[10px] font-medium transition-colors duration-150 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;