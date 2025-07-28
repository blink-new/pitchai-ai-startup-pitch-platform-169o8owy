import React from 'react'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { FileText, Video, Eye, Download, Share2, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'

export const PitchesPage: React.FC = () => {
  // Mock data - replace with real data from API
  const pitches = [
    {
      id: '1',
      title: 'TechStart Pitch Deck v3',
      type: 'deck',
      status: 'completed',
      score: 8.5,
      uploadedAt: '2024-01-20T10:30:00Z',
      description: 'Series A funding presentation for TechStart AI platform'
    },
    {
      id: '2',
      title: 'Investor Presentation Video',
      type: 'video',
      status: 'processing',
      score: null,
      uploadedAt: '2024-01-19T15:45:00Z',
      description: '5-minute pitch video for investor meeting'
    },
    {
      id: '3',
      title: 'Series A Pitch Deck',
      type: 'deck',
      status: 'completed',
      score: 7.2,
      uploadedAt: '2024-01-18T09:15:00Z',
      description: 'Updated pitch deck with financial projections'
    },
    {
      id: '4',
      title: 'Demo Day Presentation',
      type: 'deck',
      status: 'completed',
      score: 9.1,
      uploadedAt: '2024-01-15T14:20:00Z',
      description: 'Y Combinator Demo Day presentation'
    }
  ]

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout title="My Pitches">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Pitches</h1>
            <p className="text-muted-foreground">
              Manage and track all your pitch analyses in one place.
            </p>
          </div>
          <Button>
            Upload New Pitch
          </Button>
        </div>

        <div className="grid gap-6">
          {pitches.map((pitch) => (
            <Card key={pitch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-muted p-2">
                      {pitch.type === 'deck' ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <Video className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{pitch.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {pitch.description}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploaded {formatDate(pitch.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(pitch.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Analysis
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              {pitch.score && (
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium">Overall Score</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-2xl font-bold">{pitch.score}</span>
                          <span className="text-muted-foreground">/10</span>
                        </div>
                      </div>
                      <Progress value={pitch.score * 10} className="w-32" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {pitches.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pitches yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first pitch deck or video to get started with AI analysis.
              </p>
              <Button>
                Upload Your First Pitch
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}