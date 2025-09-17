// src/components/dashboard/RecentActivity.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  UserPlus,
  Upload,
  Eye,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ActivityItem {
  id: string;
  type: "ai_question" | "essay_event" | "doc_upload" | "college_view" | "login";
  studentName: string;
  studentId: string;
  title: string;
  timestamp: Date;
  details?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export default function RecentActivity({
  activities,
  loading = false,
}: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "ai_question":
        return <MessageSquare className="h-4 w-4" />;
      case "essay_event":
        return <FileText className="h-4 w-4" />;
      case "doc_upload":
        return <Upload className="h-4 w-4" />;
      case "college_view":
        return <Eye className="h-4 w-4" />;
      case "login":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "ai_question":
        return "bg-blue-100 text-blue-800";
      case "essay_event":
        return "bg-green-100 text-green-800";
      case "doc_upload":
        return "bg-purple-100 text-purple-800";
      case "college_view":
        return "bg-orange-100 text-orange-800";
      case "login":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/students" className="flex items-center space-x-1">
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/students/${activity.studentId}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {activity.studentName}
                    </Link>
                    <time className="text-xs text-gray-500">
                      {format(activity.timestamp, "MMM d, h:mm a")}
                    </time>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.title}</p>
                  {activity.details && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {activity.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
