import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart2,
  Settings,
  LogOut,
  LogIn,
  Brain,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext"; // Ensure this import is present
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  authOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresAuth: true,
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: Users,
    requiresAuth: true,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    requiresAuth: true,
  },
  {
    title: "AI Insights",
    href: "/ai-insights",
    icon: Brain,
    requiresAuth: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    requiresAuth: true,
  },
];

export const Sidebar = () => {
  const { isLoggedIn, logout, appConfig } = useAppContext();
  const location = useLocation();

  const filteredNavItems = navItems.filter((item) =>
    item.requiresAuth ? isLoggedIn : true,
  );

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 lg:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-lg font-bold text-sidebar-primary-foreground">
            {appConfig.appName}
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                    : "text-sidebar-foreground hover:text-sidebar-primary",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        {isLoggedIn ? (
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-sm font-medium text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        ) : (
          <Link to="/login">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
            >
              <LogIn className="mr-3 h-5 w-5" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};