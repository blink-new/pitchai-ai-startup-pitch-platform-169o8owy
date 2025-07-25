import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { 
  Users, 
  FileText, 
  Activity, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  Database,
  Shield,
  BarChart3,
  UserCheck,
  Building2
} from 'lucide-react'

export const AdminDashboard: React.FC = () => {
  // Mock data for admin dashboard
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Pitches',
      value: '1,234',
      change: '+8%',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'AI Analyses',
      value: '5,678',
      change: '+25%',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+18%',
      icon: DollarSign,
      color: 'text-amber-600'
    }
  ]

  const systemHealth = [
    { name: 'API Response Time', value: 95, status: 'good' },
    { name: 'Database Performance', value: 88, status: 'good' },
    { name: 'AI Processing Queue', value: 72, status: 'warning' },
    { name: 'Storage Usage', value: 45, status: 'good' }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'user_signup',
      message: 'New founder registered: sarah.chen@techflow.ai',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: 2,
      type: 'pitch_upload',
      message: 'Pitch deck uploaded by GreenEnergy Solutions',
      timestamp: '5 minutes ago',
      severity: 'info'
    },
    {
      id: 3,
      type: 'ai_analysis',
      message: 'AI analysis completed for HealthTech Pro',
      timestamp: '8 minutes ago',
      severity: 'success'
    },
    {
      id: 4,
      type: 'system_alert',
      message: 'High AI processing queue detected',
      timestamp: '12 minutes ago',
      severity: 'warning'
    },
    {
      id: 5,
      type: 'investor_action',
      message: 'Investor downloaded report for TechFlow AI',
      timestamp: '15 minutes ago',
      severity: 'info'
    }
  ]

  const userBreakdown = [
    { role: 'Founders', count: 1847, percentage: 65 },
    { role: 'Investors', count: 892, percentage: 31 },
    { role: 'Admins', count: 108, percentage: 4 }
  ]

  const getHealthColor = (value: number, status: string) => {
    if (status === 'warning') return 'bg-amber-500'
    if (value >= 90) return 'bg-green-500'
    if (value >= 70) return 'bg-blue-500'
    return 'bg-red-500'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-amber-100 text-amber-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor platform performance, manage users, and oversee system operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* System Health and User Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Real-time monitoring of platform performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{metric.name}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                    style={{
                      '--progress-background': getHealthColor(metric.value, metric.status)
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of users across different roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBreakdown.map((user, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {user.role === 'Founders' && <UserCheck className="h-4 w-4 text-blue-600" />}
                      {user.role === 'Investors' && <Building2 className="h-4 w-4 text-green-600" />}
                      {user.role === 'Admins' && <Shield className="h-4 w-4 text-purple-600" />}
                      <span>{user.role}</span>
                    </div>
                    <span className="font-medium">{user.count.toLocaleString()}</span>
                  </div>
                  <Progress value={user.percentage} className="h-2" />
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0 mt-0.5">
                  {activity.type === 'user_signup' && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'pitch_upload' && <FileText className="h-4 w-4 text-green-600" />}
                  {activity.type === 'ai_analysis' && <Activity className="h-4 w-4 text-purple-600" />}
                  {activity.type === 'system_alert' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                  {activity.type === 'investor_action' && <TrendingUp className="h-4 w-4 text-indigo-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <Badge className={getSeverityColor(activity.severity)}>
                  {activity.severity}
                </Badge>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            View All Activity
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Database Management</CardTitle>
            <CardDescription>
              Manage data, backups, and migrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Database Size</span>
                <span className="font-medium">2.4 GB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Last Backup</span>
                <span className="font-medium">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Active Connections</span>
                <span className="font-medium">47</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Database Console
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Processing</CardTitle>
            <CardDescription>
              Monitor AI analysis queue and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Queue Length</span>
                <span className="font-medium">23 jobs</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Avg Processing Time</span>
                <span className="font-medium">2.3 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium">98.7%</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              AI Console
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Analytics</CardTitle>
            <CardDescription>
              View detailed usage and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Daily Active Users</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Conversion Rate</span>
                <span className="font-medium">12.4%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Churn Rate</span>
                <span className="font-medium">2.1%</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Full Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}