// src/components/dashboard/QuickFilters.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
  Users,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickFiltersProps {
  stats: {
    notContactedIn7Days: number;
    highIntentStudents: number;
    needsEssayHelp: number;
    studentsInEssayStage: number;
    activeStudents: number;
  };
}

export default function QuickFilters({ stats }: QuickFiltersProps) {
  const router = useRouter();

  const filters = [
    {
      label: "Not contacted (7d)",
      count: stats.notContactedIn7Days,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      query: "notContactedDays=7",
      urgent: stats.notContactedIn7Days > 10,
    },
    {
      label: "High intent",
      count: stats.highIntentStudents,
      icon: TrendingUp,
      color: "bg-green-100 text-green-800 hover:bg-green-200",
      query: "highIntent=true",
    },
    {
      label: "Needs essay help",
      count: stats.needsEssayHelp,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      query: "needsEssayHelp=true",
      urgent: true,
    },
    {
      label: "Essay stage",
      count: stats.studentsInEssayStage,
      icon: FileText,
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      query: "applicationStatus=Applying",
    },
    {
      label: "Recently active",
      count: stats.activeStudents,
      icon: Users,
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      query: "recentlyActive=true",
    },
  ];

  const handleFilterClick = (query: string) => {
    router.push(`/students?${query}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Quick Filters</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.label}
              variant="ghost"
              onClick={() => handleFilterClick(filter.query)}
              className={`h-auto p-3 flex items-center space-x-2 rounded-lg border ${filter.color} transition-all hover:shadow-sm`}
              disabled={filter.count === 0}
            >
              <Icon className="h-4 w-4" />
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{filter.label}</span>
                  {filter.urgent && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1.5 py-0.5"
                    >
                      !
                    </Badge>
                  )}
                </div>
                <div className="text-lg font-bold">{filter.count}</div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="text-sm text-gray-500">
        Click any filter to view matching students
      </div>
    </div>
  );
}
