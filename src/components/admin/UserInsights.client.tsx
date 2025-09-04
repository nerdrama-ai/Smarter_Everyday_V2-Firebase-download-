'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, TrendingUp, Target, BarChart as BarChartIcon, LineChart as LineChartIcon, Download } from "lucide-react";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, BarChart, LineChart } from 'recharts';
import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import * as XLSX from 'xlsx';

const mockUserStats = {
    totalUsers: 1250,
    dailyActiveUsers: 340,
    averageAccuracy: 78.5,
    userGrowthData: [
        { name: 'Jan', users: 200 },
        { name: 'Feb', users: 300 },
        { name: 'Mar', users: 450 },
        { name: 'Apr', users: 600 },
        { name: 'May', users: 800 },
        { name: 'Jun', users: 1250 },
    ],
    quizEngagementData: [
        { name: 'Mon', played: 300, avgScore: 7.5 },
        { name: 'Tue', played: 320, avgScore: 8.1 },
        { name: 'Wed', played: 280, avgScore: 7.2 },
        { name: 'Thu', played: 350, avgScore: 7.8 },
        { name: 'Fri', played: 400, avgScore: 8.5 },
        { name: 'Sat', played: 500, avgScore: 8.9 },
        { name: 'Sun', played: 600, avgScore: 9.1 },
    ]
}


export function UserInsights() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleDownload = () => {
        const wb = XLSX.utils.book_new();

        // Summary Stats
        const summaryData = [
            { "Metric": "Total Users", "Value": mockUserStats.totalUsers },
            { "Metric": "Daily Active Users", "Value": mockUserStats.dailyActiveUsers },
            { "Metric": "Average Accuracy", "Value": `${mockUserStats.averageAccuracy}%` },
        ];
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, "Summary Stats");

        // User Growth data
        const userGrowthWs = XLSX.utils.json_to_sheet(mockUserStats.userGrowthData);
        XLSX.utils.book_append_sheet(wb, userGrowthWs, "User Growth");

        // Quiz Engagement data
        const quizEngagementWs = XLSX.utils.json_to_sheet(mockUserStats.quizEngagementData);
        XLSX.utils.book_append_sheet(wb, quizEngagementWs, "Weekly Quiz Engagement");

        XLSX.writeFile(wb, "User_Insights_Report.xlsx");
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-end">
                <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockUserStats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockUserStats.dailyActiveUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockUserStats.averageAccuracy}%</div>
                        <p className="text-xs text-muted-foreground">Across all quizzes</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                            <BarChartIcon className="h-5 w-5 text-primary" />
                            User Growth
                        </CardTitle>
                        <CardDescription>Total users over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isClient && (
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={mockUserStats.userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                     contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                        color: "hsl(var(--foreground))"
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="users" fill="hsl(var(--primary))" name="Total Users" />
                            </BarChart>
                        </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5 text-primary" />
                            Weekly Quiz Engagement
                        </CardTitle>
                        <CardDescription>Quizzes played and average score per day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isClient && (
                         <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={mockUserStats.quizEngagementData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis yAxisId="left" stroke="hsl(var(--primary))" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" fontSize={12} />
                                <Tooltip
                                     contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                        color: "hsl(var(--foreground))"
                                    }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="played" fill="hsl(var(--primary))" name="Quizzes Played" />
                                <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="hsl(var(--accent))" name="Avg. Score" />
                            </ComposedChart>
                        </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
