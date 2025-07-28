import React from 'react'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { BarChart3, Download, Share2, Eye, FileText, Video, MessageSquare, TrendingUp } from 'lucide-react'

export const ReportsPage: React.FC = () => {
  // Mock data - replace with real data from API
  const reports = [
    {
      id: '1',
      title: 'TechStart Pitch Analysis Report',
      type: 'comprehensive',
      basedOn: 'TechStart Pitch Deck v3 + Video',
      overallScore: 8.5,
      createdAt: '2024-01-20T10:30:00Z',
      sections: ['Deck Analysis', 'Video Analysis', 'Q&A Simulation'],
      status: 'ready',
      shareUrl: 'https://pitchai.com/shared/abc123'
    },
    {
      id: '2',
      title: 'Demo Day Presentation Report',
      type: 'deck-only',
      basedOn: 'Demo Day Presentation',
      overallScore: 9.1,
      createdAt: '2024-01-18T09:15:00Z',
      sections: ['Deck Analysis', 'Q&A Simulation'],
      status: 'ready',
      shareUrl: 'https://pitchai.com/shared/def456'
    },
    {
      id: '3',
      title: 'Series A Pitch Report',
      type: 'video-only',
      basedOn: 'Series A Pitch Recording',
      overallScore: 7.6,
      createdAt: '2024-01-15T14:20:00Z',
      sections: ['Video Analysis'],
      status: 'ready',
      shareUrl: 'https://pitchai.com/shared/ghi789'
    },
    {
      id: '4',
      title: 'Investor Meeting Prep Report',
      type: 'comprehensive',
      basedOn: 'Multiple Sources',
      overallScore: null,
      createdAt: '2024-01-22T16:45:00Z',
      sections: ['Deck Analysis', 'Video Analysis', 'Q&A Simulation'],
      status: 'generating',
      shareUrl: null
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comprehensive':
        return <BarChart3 className="h-5 w-5 text-purple-600" />
      case 'deck-only':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'video-only':
        return <Video className="h-5 w-5 text-green-600" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'comprehensive':
        return <Badge className="bg-purple-100 text-purple-800">Comprehensive</Badge>
      case 'deck-only':
        return <Badge className="bg-blue-100 text-blue-800">Deck Analysis</Badge>
      case 'video-only':
        return <Badge className="bg-green-100 text-green-800">Video Analysis</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800">Generating</Badge>
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              Download and share comprehensive analysis reports of your pitches.
            </p>
          </div>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>

        {/* Report Types Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg text-purple-900">Comprehensive</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-700">
                Complete analysis including deck, video, and Q&A simulation results
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Deck Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700">
                Focused on pitch deck content, storytelling, and slide effectiveness
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg text-green-900">Video Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700">
                Delivery analysis including pace, clarity, and confidence metrics
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-muted p-2">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Based on: {report.basedOn}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        Generated: {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(report.type)}
                    {getStatusBadge(report.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {report.overallScore && (
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="text-sm font-medium">Overall Score</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-2xl font-bold">{report.overallScore}</span>
                            <span className="text-muted-foreground">/10</span>
                          </div>
                        </div>
                        <Progress value={report.overallScore * 10} className="w-24" />
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Includes</p>
                      <div className="flex flex-wrap gap-1">
                        {report.sections.map((section, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {report.status === 'ready' && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  )}
                  
                  {report.status === 'generating' && (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <span className="text-sm text-muted-foreground">Generating...</span>
                    </div>
                  )}
                </div>
                
                {report.shareUrl && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Shareable Link</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {report.shareUrl}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Copy Link
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports generated yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first comprehensive analysis report from your pitch data.
              </p>
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Your First Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}