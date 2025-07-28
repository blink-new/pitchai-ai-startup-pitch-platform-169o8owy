import React from 'react'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Video, Play, Upload, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export const VideoAnalysisPage: React.FC = () => {
  // Mock data - replace with real data from API
  const videos = [
    {
      id: '1',
      title: 'Investor Presentation Video',
      duration: '4:32',
      status: 'completed',
      uploadedAt: '2024-01-20T10:30:00Z',
      analysis: {
        overallScore: 8.2,
        paceScore: 7.8,
        clarityScore: 8.5,
        confidenceScore: 8.4,
        fillerWords: 12,
        wordsPerMinute: 145
      }
    },
    {
      id: '2',
      title: 'Demo Day Pitch Video',
      duration: '3:45',
      status: 'processing',
      uploadedAt: '2024-01-19T15:45:00Z',
      analysis: null
    },
    {
      id: '3',
      title: 'Series A Pitch Recording',
      duration: '5:00',
      status: 'completed',
      uploadedAt: '2024-01-18T09:15:00Z',
      analysis: {
        overallScore: 7.6,
        paceScore: 7.2,
        clarityScore: 8.1,
        confidenceScore: 7.4,
        fillerWords: 18,
        wordsPerMinute: 132
      }
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
        return <Badge className="bg-green-100 text-green-800">Analyzed</Badge>
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
      year: 'numeric'
    })
  }

  return (
    <Layout title="Video Analysis">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Video Analysis</h1>
            <p className="text-muted-foreground">
              Analyze your pitch videos for delivery, pace, and confidence.
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </div>

        {/* Upload Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Video Analysis Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Speech Analysis</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Pace and rhythm</li>
                  <li>• Filler word detection</li>
                  <li>• Clarity assessment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Delivery Insights</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Confidence indicators</li>
                  <li>• Tone analysis</li>
                  <li>• Energy levels</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Improvement suggestions</li>
                  <li>• Practice areas</li>
                  <li>• Timing optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video List */}
        <div className="grid gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Video className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{video.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Duration: {video.duration}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Uploaded: {formatDate(video.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(video.status)}
                    {getStatusBadge(video.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Play Video
                    </Button>
                    
                    {video.analysis && (
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">Overall Score</p>
                          <p className="text-2xl font-bold text-primary">
                            {video.analysis.overallScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">WPM</p>
                          <p className="text-lg font-semibold">
                            {video.analysis.wordsPerMinute}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Filler Words</p>
                          <p className="text-lg font-semibold">
                            {video.analysis.fillerWords}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {video.analysis && (
                    <Button>
                      View Full Analysis
                    </Button>
                  )}
                </div>
                
                {video.analysis && (
                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pace</span>
                        <span className="text-sm">{video.analysis.paceScore}/10</span>
                      </div>
                      <Progress value={video.analysis.paceScore * 10} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Clarity</span>
                        <span className="text-sm">{video.analysis.clarityScore}/10</span>
                      </div>
                      <Progress value={video.analysis.clarityScore * 10} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Confidence</span>
                        <span className="text-sm">{video.analysis.confidenceScore}/10</span>
                      </div>
                      <Progress value={video.analysis.confidenceScore * 10} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos uploaded yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first pitch video to get AI-powered delivery analysis.
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}