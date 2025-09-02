import React from "react";
import { BellRing, CheckCircle2, Info, XCircle, Users, BarChart2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ActivityLog } from "@/types";
import { mockActivityLogs } from "@/lib/mockData"; // Using mock data for now

interface NotificationPanelProps {
  logs?: ActivityLog[];
}

const NotificationPanel = ({ logs = mockActivityLogs }: NotificationPanelProps) => {
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
        return <BellRing className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" /> Recent Activity
        </CardTitle>
        <CardDescription>Latest updates and system events.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="pt-1">{getIcon(log.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                      {log.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                No recent activity.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;