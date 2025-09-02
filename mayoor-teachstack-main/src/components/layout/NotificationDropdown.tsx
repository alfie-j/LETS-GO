import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, Info, Users, BarChart2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityLog } from '@/types';
import { mockActivityLogs } from '@/lib/mockData'; // Using mock data for now

interface NotificationDropdownProps {
  notifications?: ActivityLog[];
  unreadCount?: number;
}

const NotificationDropdown = ({
  notifications = mockActivityLogs,
  unreadCount = 3, // Mock unread count for demonstration
}: NotificationDropdownProps) => {
  const getIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "attendance":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "system":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "teacher_management":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "report":
        return <BarChart2 className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 shadow-xl border-border/50 bg-card/90 backdrop-blur-md" align="end" forceMount>
        <DropdownMenuLabel className="font-semibold text-foreground">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[200px]">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((log, index) => ( // Show up to 5 recent notifications
              <DropdownMenuItem key={log.id} className="flex items-start gap-3 py-2 cursor-pointer hover:bg-accent/50">
                <div className="pt-1">{getIcon(log.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {log.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem className="text-sm text-muted-foreground text-center py-4" disabled>
              No new notifications.
            </DropdownMenuItem>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center hover:bg-accent/50 cursor-pointer">
          <Link to="/dashboard">View All Activity</Link> {/* Link to dashboard for now, could be a dedicated notifications page */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;