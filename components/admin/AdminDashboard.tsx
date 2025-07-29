"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Bell,
  Settings,
  Search,
  Menu,
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  MessageSquare,
  FileText,
  UserPlus,
  Clock,
  CheckCircle,
  ExternalLink,
  Plus,
  BarChart3,
  Mail,
  Wrench,
} from "lucide-react";

export default function AdminDashboard() {
  // Chart data
  const enrollmentData = [
    { month: "Aug", students: 1180, teachers: 68 },
    { month: "Sep", students: 1195, teachers: 69 },
    { month: "Oct", students: 1208, teachers: 71 },
    { month: "Nov", students: 1225, teachers: 72 },
    { month: "Dec", students: 1238, teachers: 73 },
    { month: "Jan", students: 1247, teachers: 73 },
  ];

  const performanceData = [
    { subject: "Math", avgGrade: 3.2, target: 3.5 },
    { subject: "English", avgGrade: 3.6, target: 3.5 },
    { subject: "Science", avgGrade: 3.4, target: 3.5 },
    { subject: "History", avgGrade: 3.5, target: 3.5 },
    { subject: "Arts", avgGrade: 3.8, target: 3.5 },
    { subject: "PE", avgGrade: 3.9, target: 3.5 },
  ];

  const attendanceData = [
    { week: "Week 1", rate: 96.2 },
    { week: "Week 2", rate: 95.8 },
    { week: "Week 3", rate: 94.9 },
    { week: "Week 4", rate: 95.4 },
    { week: "Week 5", rate: 93.8 },
    { week: "Week 6", rate: 94.2 },
  ];

  const gradeDistribution = [
    { grade: "9th Grade", count: 320, percentage: 25.7 },
    { grade: "10th Grade", count: 315, percentage: 25.3 },
    { grade: "11th Grade", count: 308, percentage: 24.7 },
    { grade: "12th Grade", count: 304, percentage: 24.4 },
  ];

  const chartColors = {
    primary: "hsl(213, 74%, 59%)",
    secondary: "hsl(261, 78%, 60%)",
    accent: "hsl(156, 61%, 52%)",
    warning: "hsl(35, 91%, 62%)",
    success: "hsl(142, 62%, 45%)",
    muted: "hsl(210, 14%, 89%)",
  };

  // Activity feed data
  const recentActivities = [
    {
      id: 1,
      type: "enrollment",
      title: "New student enrollment",
      description: "Emma Rodriguez enrolled in 10th grade",
      timestamp: "2 hours ago",
      icon: UserPlus,
      iconColor: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 2,
      type: "announcement",
      title: "School announcement sent",
      description: "Winter break schedule posted to all families",
      timestamp: "4 hours ago",
      icon: MessageSquare,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: 3,
      type: "maintenance",
      title: "Maintenance request completed",
      description: "Heating system repair in Building A completed",
      timestamp: "6 hours ago",
      icon: CheckCircle,
      iconColor: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 4,
      type: "alert",
      title: "Attendance alert",
      description: "15 students marked absent without notification",
      timestamp: "8 hours ago",
      icon: AlertCircle,
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 5,
      type: "report",
      title: "Monthly report generated",
      description: "October academic performance report ready",
      timestamp: "1 day ago",
      icon: FileText,
      iconColor: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      id: 6,
      type: "event",
      title: "Event scheduled",
      description: "Parent-teacher conferences scheduled for Nov 15-17",
      timestamp: "1 day ago",
      icon: Calendar,
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: 1,
      title: "Send Announcement",
      description: "Broadcast message to all students and parents",
      icon: MessageSquare,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      action: "Create",
    },
    {
      id: 2,
      title: "Generate Report",
      description: "Create custom academic or attendance reports",
      icon: BarChart3,
      iconColor: "text-secondary",
      bgColor: "bg-secondary/10",
      action: "Generate",
    },
    {
      id: 3,
      title: "Schedule Event",
      description: "Add new events to the school calendar",
      icon: Calendar,
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
      action: "Schedule",
    },
    {
      id: 4,
      title: "Manage Users",
      description: "Add, edit, or remove student and staff accounts",
      icon: Users,
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
      action: "Manage",
    },
    {
      id: 5,
      title: "Send Newsletter",
      description: "Create and send weekly school newsletter",
      icon: Mail,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      action: "Send",
    },
    {
      id: 6,
      title: "System Settings",
      description: "Configure school settings and preferences",
      icon: Settings,
      iconColor: "text-muted-foreground",
      bgColor: "bg-muted",
      action: "Configure",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Title */}
          {/* <div className="mb-8">
            <h2 className="text-display-medium font-normal text-foreground mb-2">
              Dashboard Overview
            </h2>
            <p className="text-body-large text-muted-foreground">
              Welcome back! Here's what's happening at your school today.
            </p>
          </div> */}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Students */}
            <Card className="google-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  1,247
                </div>
                <div className="flex items-center text-body-small text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                  <span className="text-success font-medium">+2.3%</span>
                  <span className="ml-1">from last year</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Teachers */}
            <Card className="google-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Active Teachers
                </CardTitle>
                <GraduationCap className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  73
                </div>
                <div className="flex items-center text-body-small text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                  <span className="text-success font-medium">+3</span>
                  <span className="ml-1">new hires</span>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Rate */}
            <Card className="google-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Attendance Rate
                </CardTitle>
                <Calendar className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  94.2%
                </div>
                <div className="flex items-center text-body-small text-muted-foreground">
                  <TrendingDown className="mr-1 h-3 w-3 text-warning" />
                  <span className="text-warning font-medium">-1.2%</span>
                  <span className="ml-1">this week</span>
                </div>
              </CardContent>
            </Card>

            {/* Academic Performance */}
            <Card className="google-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Avg GPA
                </CardTitle>
                <Award className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  3.42
                </div>
                <div className="flex items-center text-body-small text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                  <span className="text-success font-medium">+0.08</span>
                  <span className="ml-1">this semester</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Course Completion */}
            <Card className="google-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Course Completion
                </CardTitle>
                <BookOpen className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  89.3%
                </div>
                <p className="text-body-small text-muted-foreground mt-1">
                  1,114 of 1,247 students on track
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: "89.3%" }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="google-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Upcoming Events
                </CardTitle>
                <Calendar className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  12
                </div>
                <p className="text-body-small text-muted-foreground mt-1">
                  Events scheduled this month
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-body-small">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span>Parent-Teacher Conference</span>
                  </div>
                  <div className="flex items-center text-body-small">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                    <span>Science Fair</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts & Issues */}
            <Card className="google-card border-warning/20 bg-warning/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-label-large font-medium">
                  Active Alerts
                </CardTitle>
                <AlertCircle className="h-5 w-5 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-display-small font-bold text-foreground">
                  7
                </div>
                <p className="text-body-small text-muted-foreground mt-1">
                  Items requiring attention
                </p>
                <div className="mt-3 space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/30"
                  >
                    3 Maintenance Issues
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-destructive/10 text-destructive border-destructive/30"
                  >
                    4 Student Absences
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Enrollment Trends */}
            <Card className="google-card">
              <CardHeader>
                <CardTitle className="text-headline-medium">
                  Enrollment Trends
                </CardTitle>
                <CardDescription>
                  Student and teacher growth over the academic year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={enrollmentData}>
                    <defs>
                      <linearGradient
                        id="studentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.primary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="teacherGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.secondary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.secondary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.muted}
                    />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "var(--elevation-2)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke={chartColors.primary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#studentGradient)"
                      name="Students"
                    />
                    <Area
                      type="monotone"
                      dataKey="teachers"
                      stroke={chartColors.secondary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#teacherGradient)"
                      name="Teachers"
                      yAxisId="right"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Academic Performance by Subject */}
            <Card className="google-card">
              <CardHeader>
                <CardTitle className="text-headline-medium">
                  Academic Performance
                </CardTitle>
                <CardDescription>
                  Average GPA by subject vs. target goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.muted}
                    />
                    <XAxis
                      dataKey="subject"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 4]} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "var(--elevation-2)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="avgGrade"
                      fill={chartColors.primary}
                      name="Current GPA"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="target"
                      fill={chartColors.accent}
                      name="Target GPA"
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.6}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Attendance Trends */}
            <Card className="google-card">
              <CardHeader>
                <CardTitle className="text-headline-medium">
                  Weekly Attendance
                </CardTitle>
                <CardDescription>
                  Student attendance rates over the past 6 weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.muted}
                    />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[90, 100]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "var(--elevation-2)",
                      }}
                      formatter={(value) => [`${value}%`, "Attendance Rate"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke={chartColors.accent}
                      strokeWidth={3}
                      dot={{ fill: chartColors.accent, strokeWidth: 2, r: 6 }}
                      activeDot={{
                        r: 8,
                        stroke: chartColors.accent,
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card className="google-card">
              <CardHeader>
                <CardTitle className="text-headline-medium">
                  Grade Distribution
                </CardTitle>
                <CardDescription>
                  Student enrollment by grade level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="60%" height={250}>
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        <Cell fill={chartColors.primary} />
                        <Cell fill={chartColors.secondary} />
                        <Cell fill={chartColors.accent} />
                        <Cell fill={chartColors.warning} />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "var(--elevation-2)",
                        }}
                        formatter={(value, name) => [`${value} students`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 w-1/3">
                    {gradeDistribution.map((item, index) => (
                      <div key={item.grade} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: [
                              chartColors.primary,
                              chartColors.secondary,
                              chartColors.accent,
                              chartColors.warning,
                            ][index],
                          }}
                        ></div>
                        <div className="flex-1">
                          <p className="text-body-small font-medium">
                            {item.grade}
                          </p>
                          <p className="text-body-small text-muted-foreground">
                            {item.count} ({item.percentage}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
