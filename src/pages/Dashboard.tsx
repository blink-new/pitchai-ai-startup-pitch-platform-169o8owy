import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  FileText, 
  Video, 
  MessageSquare, 
  BarChart3, 
  Upload, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/layout/Layout'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  // Mock data - replace with real data from API
  const stats = {
    totalPitches: 12,
    completedAnalyses: 8,
    averageScore: 7.8,
    improvementRate: 23
  }

  const recentPitches = [
    {
      id: '1',
      title: 'TechStart Pitch Deck v3',
      type: 'deck',
      status: 'completed',
      score: 8.5,
      uploadedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      title: 'Investor Presentation Video',
      type: 'video',
      status: 'processing',
      score: null,
      uploadedAt: '2024-01-19T15:45:00Z'
    },
    {
      id: '3',
      title: 'Series A Pitch Deck',
      type: 'deck',
      status: 'completed',
      score: 7.2,
      uploadedAt: '2024-01-18T09:15:00Z'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.displayName || 'Founder'}!
            </h1>
            <p className="text-muted-foreground">
              Here's your pitch analysis overview and recent activity.
            </p>
          </div>
          <Link to="/upload">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPitches}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Analyses</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPitches - stats.completedAnalyses} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}/10</div>
              <p className="text-xs text-muted-foreground">
                +0.5 from last analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.improvementRate}%</div>
              <p className="text-xs text-muted-foreground">
                Since first pitch
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/upload">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Upload Pitch Deck</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your PDF or PowerPoint presentation for AI analysis
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/videos">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Video className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Record Pitch Video</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your pitch video for delivery and speech analysis
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/qa-simulation">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Q&A Simulation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Practice with AI-generated investor questions and feedback
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pitches</CardTitle>
            <CardDescription>
              Your latest pitch analyses and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPitches.map((pitch) => (
                <div key={pitch.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-muted p-2">
                      {pitch.type === 'deck' ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <Video className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{pitch.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {formatDate(pitch.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {pitch.score && (
                      <div className="text-right">
                        <div className="font-medium">{pitch.score}/10</div>
                        <Progress value={pitch.score * 10} className="w-16" />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(pitch.status)}
                      {getStatusBadge(pitch.status)}
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}