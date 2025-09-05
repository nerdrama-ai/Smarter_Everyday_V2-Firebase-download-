'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, TrendingUp, Target, BarChart as BarChartIcon, LineChart as LineChartIcon, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { Button } from "../ui/button";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

// ---- Mock Data ----
const mockUserStats = {
  totalUsers: 1250,
  dailyActiveUsers: 340,
  averageAccuracy: 78.5,
  userGrowthData: [
    { name: "Jan", users: 200 },
    { name: "Feb", users: 300 },
    { name: "Mar", users: 450 },
    { name: "Apr", users: 600 },
    { name: "May", users: 800 },
    { name: "Jun", users: 1250 },
  ],
  quizEngagementData: [
    { name: "Mon", played: 300, avgScore: 7.5 },
    { name: "Tue", played: 320, avgScore: 8.1 },
    { name: "Wed", played: 280, avgScore: 7.2 },
    { name: "Thu", played: 350, avgScore: 7.8 },
    { name: "Fri", played: 400, avgScore: 8.5 },
    { name: "Sat", played: 500, avgScore: 8.9 },
    { name: "Sun", played: 600, avgScore: 9.1 },
  ],
};

// ---- Small Helper for Trend ----
function Trend({ value }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("flex items-center gap-1 text-xs", isPositive ? "text-green-600" : "text-red-600")}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}%
    </span>
  );
}

// ---- Main Component ----
export function UserInsights() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    const summaryData = [
      { Metric: "Total Users", Value: mockUserStats.totalUsers },
      { Metric: "Daily Active Users", Value: mockUserStats.dailyActiveUsers },
      { Metric: "Average Accuracy", Value: `${mockUserStats.averageAccuracy}%` },
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), "Summary Stats");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mockUserStats.userGrowthData), "User Growth");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mockUserStats.quizEngagementData), "Weekly Quiz Engagement");

    const filename = `User_Insights_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  if (!isClient) return null;

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{mockUserStats.totalUsers.toLocaleString()}</div>
              <Trend value={20.1} />
            </div>
            <p className="text-xs text-muted-foreground">Since last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{mockUserStats.dailyActiveUsers.toLocaleString()}</div>
              <Trend value={5.2} />
            </div>
            <p className="text-xs text-muted-foreground">Since yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{mockUserStats.averageAccuracy}%</div>
              <Trend value={1.8} />
            </div>
            <p className="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              User Growth
            </CardTitle>
            <CardDescription>Total users over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mockUserStats.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Bar dataKey="users" fill="hsl(var(--primary))" name="Users" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Trend" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Weekly Quiz Engagement
            </CardTitle>
            <CardDescription>Quizzes played & average score per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mockUserStats.quizEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Bar yAxisId="left" dataKey="played" fill="hsl(var(--primary))" name="Quizzes Played" />
                <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Avg. Score" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
